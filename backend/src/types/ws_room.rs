use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use surrealdb::types::{RecordId, Uuid};
use crate::types::ws_player::WSPlayer;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsRoom {
    pub map: RecordId,
}