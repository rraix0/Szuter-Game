use serde::{Deserialize, Serialize};
use surrealdb::types::{RecordId};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsRoom {
    pub map: RecordId,
}