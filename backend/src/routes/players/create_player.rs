use std::collections::HashMap;
use std::sync::Arc;
use crate::types::app_state::{AppState};
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::types::{Bytes, SurrealValue};
use tokio::sync::Mutex;
use uuid::Uuid;
use crate::types::all_types::{ObjectType};
use crate::types::ws_player::{PlayerPosition, WSPlayer};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct CreatePlayer {
    pub name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct CreatePlayerResponse {
    pub uuid: Uuid,
    pub jwt: Uuid,
    pub name: String,
}



pub async fn create_player_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<CreatePlayer>
) -> Result<Json<CreatePlayerResponse>, StatusCode>  {
    let mut app_state = app_state.lock().await;

    let uuid = Uuid::new_v4();
    let jwt = Uuid::new_v4();

    let player:WSPlayer = WSPlayer {
        jwt,
        name: data.name.clone(),
        room: None,
        pos: PlayerPosition { x: 0, y: 0, direction: 0 },
        hp: 100,
    };


    app_state.game.players.insert(
        uuid.clone(),
        player
    );

    println!("Player created: {:?}", app_state.game.players);

    Ok(Json(
        CreatePlayerResponse{
            uuid,
            jwt,
            name: data.name
        }
    ))
}