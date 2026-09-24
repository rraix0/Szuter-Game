use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;
use tokio::sync::broadcast::Sender;
use uuid::Uuid;
use crate::types::game_main::Game;

#[derive(Clone)]
pub struct AppState {
    pub db:Surreal<Client>,
    pub game: Game
}

