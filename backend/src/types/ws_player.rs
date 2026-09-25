use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use tokio::task::JoinHandle;
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
    pub uuid: Uuid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JoinRoom {
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct LoginWs {
    pub uuid: Uuid,
    pub jwt: Uuid,
}


// RECEIVE

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum  WsPlayerRecv {
    Login(LoginWs),
    Position(PlayerPosition),
    SelectWeapon(SelectWeapon),
    JoinRoom(JoinRoom),
}


// RESPONSE


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsPlayerErrorMessage {
    pub message: String,
}
impl WsPlayerErrorMessage {
    pub fn from(msg :String) -> WsPlayerErrorMessage {
        WsPlayerErrorMessage {
            message: msg,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsPlayerInfoMessage {
    pub message: String,
}
impl WsPlayerInfoMessage {
    pub fn from(msg :String) -> WsPlayerInfoMessage {
        WsPlayerInfoMessage {
            message: msg,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendPlayersPositions {
    pub players: HashMap<Uuid, PlayerPosition>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum  WsPlayerResponse {
    PlayersPosition(SendPlayersPositions),
    InfoMessage(WsPlayerInfoMessage),
    ErrorMessage(WsPlayerErrorMessage),
}