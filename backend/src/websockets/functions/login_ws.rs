use std::sync::Arc;
use tokio::sync::broadcast::Sender;
use tokio::sync::Mutex;
use uuid::Uuid;
use crate::types::app_state::AppState;
use crate::types::ws_player::{ WsPlayerErrorMessage, WsPlayerRecv, WsPlayerResponse};


pub async fn login_ws(
    main_app_state: Arc<Mutex<AppState>>,
    player_recv: Sender<WsPlayerRecv>,
    player_send: Sender<WsPlayerResponse>
) -> Result<Uuid, String> {
    let app_state = Arc::clone(&main_app_state);


    let mut receiver = player_recv.subscribe();

    if let Ok(login) = receiver.recv().await {
        if let WsPlayerRecv::Login(login) = login {
            let mut app_state = app_state.lock().await;
            let player = app_state
                .game
                .get_player_authorized(&login.uuid, &login.jwt);
            match player {
                Ok(_) => {
                    Ok(login.uuid)
                }
                Err(err) => {
                    let _ = player_send.send(WsPlayerResponse::ErrorMessage(WsPlayerErrorMessage::from(err.clone())));
                    Err(format!("{}", err))
                }
            }
        } else {
            let _ = player_send.send(WsPlayerResponse::ErrorMessage(WsPlayerErrorMessage::from("Wrong login data type!".to_string())));
            Err("Wrong login data type".to_string())
        }
    } else {
        Err("Error while receiving data".to_string())
    }
}