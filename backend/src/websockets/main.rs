use std::sync::Arc;
use std::thread;
use axum::extract::{State, WebSocketUpgrade};
use axum::extract::ws::{CloseFrame, Message, Utf8Bytes, WebSocket};
use axum::http::StatusCode;
use axum::Json;
use axum::response::Response;
use serde::{Deserialize, Serialize};
use tokio::sync::{broadcast, Mutex};
use uuid::Uuid;
use serde_json::{
    from_str,
    to_string,
};
use crate::types::app_state::{AppState};
use crate::types::ws_player::{WSPlayer, WsPlayerRecv, WsPlayerResponse};
use futures_util::{sink::SinkExt, stream::{StreamExt, SplitSink, SplitStream}};



#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct RecvWsLogin {
    pub uuid: Uuid,
    pub jwt: Uuid,
}

pub async fn ws_handler(
    State(app_state): State<Arc<Mutex<AppState>>>,
    ws: WebSocketUpgrade
) -> Response {

    ws.on_upgrade(|socket| handle_socket(socket, app_state))
}




async fn handle_socket(mut socket: WebSocket, app_state: Arc<Mutex<AppState>>) {
    let (mut sender, mut receiver) = socket.split();

    let mut app_state = app_state.lock().await;

    let mut logged_in = false;

    while !logged_in {
        if let Some(Ok(login)) = receiver.next().await {
            if let Message::Text(text) = login {
                let text = text.to_string();

                let x = serde_json::from_str::<RecvWsLogin>(&text);

                match x {
                    Ok(login) => {
                        let player = app_state
                            .game
                            .get_player_authorized(&login.uuid, &login.jwt);

                        match player {
                            Ok(_) => {
                                logged_in = true;
                            }
                            Err(_) => {
                                let _ = sender
                                    .send(Message::Close(Some(CloseFrame {
                                        code: 1008,
                                        reason: "Invalid login".into(),
                                    })))
                                    .await
                                    .ok();

                                return;
                            }
                        }
                    }

                    Err(_) => {
                        let _ = sender
                            .send(Message::Close(Some(CloseFrame {
                                code: 1008,
                                reason: "Invalid login".into(),
                            })))
                            .await
                            .ok();

                        return;
                    }
                }
            }
        }
    }






    let (player_recv, rx) = broadcast::channel::<WsPlayerRecv>(16);
    let (player_send, rx) = broadcast::channel::<String>(16);




    // create player
    let mut player_recv_clone = player_recv.subscribe();
    let mut player_send_clone = player_send.clone();


    tokio::task::spawn(async move {
        while let Ok(message) = player_recv_clone.recv().await {
            println!("RECEIVED: {:?}", message);
        }
    });

    tokio::task::spawn(async move {

    });








    let mut player_send_clone = player_send.subscribe();
    thread::spawn( async move || {

        while let Ok(x) = player_send_clone.recv().await {
            if sender.send(Message::text(x)).await.is_err() {
                println!("Disconnected");
                return;
            }
        }
        println!("Disconnected");
    });




    let mut player_recv_clone = player_recv.clone();
    let mut player_send_clone = player_send.clone();

    while let Some(msg) = receiver.next().await {
        let msg = if let Ok(msg) = msg {

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
                        let z = player_send_clone.send(err.to_string()).map_err(|err| {
                            println!("{:?}", err)
                        });
                        println!("{:?}", z);
                    }
                }
            }


        } else {
            println!("Disconnected");
            return;
        };

    }
}