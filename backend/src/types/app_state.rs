use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;
use crate::types::game_main::Game;

#[derive(Clone)]
pub struct AppState {
    pub db:Surreal<Client>,
    pub game: Game
}

