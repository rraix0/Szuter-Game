use std::sync::{Arc};
use axum::extract::{State, WebSocketUpgrade};
use axum::extract::ws::{Message, WebSocket};
use axum::response::Response;
use tokio::sync::{broadcast, Mutex};
use crate::types::app_state::{AppState};
use crate::types::ws_player::{WsPlayerErrorMessage, WsPlayerInfoMessage, WsPlayerRecv, WsPlayerResponse};
use futures_util::{sink::SinkExt, stream::{StreamExt}};
use tokio::time;
use std::time::Duration;
use tokio_util::sync::CancellationToken;
use crate::websockets::functions::login_ws::login_ws;

pub async fn ws_handler(
    State(app_state): State<Arc<Mutex<AppState>>>,
    ws: WebSocketUpgrade
) -> Response {

    ws.on_upgrade(|socket| handle_socket(socket, app_state))
}
async fn handle_socket(mut socket: WebSocket, main_app_state: Arc<Mutex<AppState>>) {
    let cancel_token = CancellationToken::new();    // to kill all threads

    let (player_recv, _rx) = broadcast::channel::<WsPlayerRecv>(16);
    let (player_send, _rx) = broadcast::channel::<WsPlayerResponse>(16);

    let (mut sender, mut receiver) = socket.split();
    // WS SENDER
    let mut player_send_receiver_clone = player_send.subscribe();
    let player_recv_clone = player_recv.clone();
    let player_send_clone = player_send.clone();

    let cancel_token_clone = cancel_token.clone();
    let token = cancel_token.child_token();
    tokio::spawn(async move {
        loop {
            tokio::select! {
                _ = token.cancelled() => {
                    println!("Task 1 zakończony");
                    break;
                }

                msg = player_send_receiver_clone.recv() => {
                    match msg {
                        Ok(msg) => {
                            let msg_json = serde_json::to_string(&msg).unwrap();
                            if sender.send(Message::text(msg_json)).await.is_err() {
                                println!("Disconnected 1");
                                cancel_token_clone.cancel();
                                return;
                            }
                        }
                        Err(_) => {}
                    }
                }

                msg = receiver.next() => {
                    if let Some(Ok(msg)) = msg {
                        if let Message::Text(text) = msg {
                            let text = text.to_string();
                            let x= serde_json::from_str::<WsPlayerRecv>(&text).map_err( |err| {
                                err
                            });

                            match x {
                                Ok(msg) => {
                                    let _ = player_recv_clone.send(msg).map_err(|err| {
                                        println!("{:?}", err)
                                    });
                                }
                                Err(err) => {
                                    println!("Failed to parse json: {:?}", err);
                                    let z = player_send_clone.send(
                                        WsPlayerResponse::ErrorMessage(
                                            WsPlayerErrorMessage::from(err.to_string())
                                        )
                                    ).map_err(|err| {
                                        println!("{:?}", err)
                                    });
                                    println!("{:?}", z);
                                }
                            }
                        }
                    } else {
                        println!("Disconnected b");
                        cancel_token_clone.cancel();
                        return;
                    }
                }
            }
        }
    });
    let player_recv_clone = player_recv.clone();
    let player_send_clone = player_send.clone();

    let app_state = Arc::clone(&main_app_state);
    let player_uuid = login_ws(app_state, player_recv_clone, player_send_clone).await.unwrap();

    // TODO: add player unlogged kick threads


    let mut player_recv_clone = player_recv.subscribe();
    let player_send_clone = player_send.clone();
    let app_state = Arc::clone(&main_app_state);
    let mut interval = time::interval(Duration::from_millis(10));

    let token = cancel_token.child_token();
    tokio::spawn(async move {
        loop {
            tokio::select! {
                _ = token.cancelled() => {
                    println!("Task 2 zakończony");
                    break;
                }

                msg = player_recv_clone.recv() => {
                    if let Ok(message) = msg {
                        println!("RECEIVED: {:?}", message);
                        match message {
                            WsPlayerRecv::Position(position) => {
                                let mut app_state = app_state.lock().await;
                                let player = app_state.game.get_player_mut(&player_uuid);
                                if let Some(player) = player {
                                    player.pos = position;
                                }
                            }
                            WsPlayerRecv::SelectWeapon(_) => {}
                            WsPlayerRecv::JoinRoom(_) => {
                                let app_state_clone = Arc::clone(&app_state);

                                let mut app_state = app_state_clone.lock().await;
                                let app_state1 = app_state_clone.lock().await;
                                let x = app_state.game.join_game(app_state1.db.clone(), player_uuid).await;
                                match x {
                                    Ok(x) => {
                                        let _ = player_send_clone.send(WsPlayerResponse::InfoMessage(WsPlayerInfoMessage::from(format!("Joined room: {}", x))));
                                    }
                                    Err(err) => {
                                        let _ = player_send_clone.send(WsPlayerResponse::ErrorMessage(WsPlayerErrorMessage::from(format!("Error joining room: {}", err))));
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                }

                _ = interval.tick() => {
                    //app_state.game.get_players_in_room(&player_uuid);
                    //print!("tick");
                    let _ = player_send_clone.send(WsPlayerResponse::InfoMessage(WsPlayerInfoMessage::from("tick".to_string())));
                }
            }
        }
    });
}