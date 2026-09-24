use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// WHOLE PLAYER
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WSPlayer {
    pub jwt: Uuid,
    pub name: String,
    pub room : Option<Uuid>,
    pub pos: PlayerPosition,
    pub hp: u32,
    //pub self_delete: bool, TODO: after player disconnect delete his data
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerPosition {
    pub x: i32,
    pub y: i32,
    pub direction: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SelectWeapon {
    pub weapon: Uuid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SelectMap {
    pub map: Uuid,
}


// RECEIVE

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum  WsPlayerRecv {
    Position(PlayerPosition),
    SelectMap(SelectMap),
    SelectWeapon(SelectWeapon),
}


// RESPONSE

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Status {
    Error,
    Info,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsPlayerInfoMessage {
    pub status: Status,
    pub message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendPlayersPositions {
    pub players: HashMap<Uuid, PlayerPosition>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum  WsPlayerResponse {
    PlayersPosition(SendPlayersPositions),
    ErrorMessage(WsPlayerInfoMessage),
}