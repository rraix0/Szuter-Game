use std::sync::Arc;
use axum::extract::{State, WebSocketUpgrade};
use axum::extract::ws::WebSocket;
use axum::response::Response;
use serde::{Deserialize, Serialize};
use tokio::sync::{broadcast, Mutex};
use uuid::Uuid;
use crate::types::app_state::AppState;

#[derive(Deserialize, Serialize, Debug, Clone)]

pub struct RecvUpdatePosition {
    weapon: Uuid,
    pos_x: i32,
    pos_y: i32,
}

pub async fn ws_handler(
    State(app_state): State<Arc<Mutex<AppState>>>,
    ws: WebSocketUpgrade
) -> Response {

    ws.on_upgrade(|socket| handle_socket(socket, app_state))
}




async fn handle_socket(mut socket: WebSocket, app_state: Arc<Mutex<AppState>>) {

    let (rx, tx) = broadcast::channel::<String>(16);

    let rrx = rx.subscribe();

    while let Some(msg) = socket.recv().await {
        let msg = if let Ok(msg) = msg {

            //let value: RecvUpdatePosition = msg.


            msg
        } else {
            println!("Disconnected");
            return;
        };

        if socket.send(msg).await.is_err() {
            println!("Disconnected");
            return;
        }
    }
}



