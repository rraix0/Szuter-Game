use std::collections::HashMap;
use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;
use tokio::sync::broadcast::Sender;
use uuid::Uuid;

#[derive(Clone)]
pub struct AppState {
    pub db:Surreal<Client>,
    pub players: Option<HashMap<Uuid, WSPlayer>>
}

#[derive(Clone)]
pub struct WSPlayer {
    pub ws: Sender<String>,
    pub name: String,
    pub pos: PlayerPosition,
}
#[derive(Clone)]
pub struct PlayerPosition {
    pub x: i32,
    pub y: i32,
}

