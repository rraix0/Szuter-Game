use serde::{Deserialize, Serialize};
use surrealdb::types::{Bytes, SurrealValue, Uuid};

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct Maps {
    pub id: Uuid,
    pub name: String,
    pub data_background: Vec<Vec<Uuid>>,
    pub data_blocks: Vec<Vec<Uuid>>,
}

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct Objects {
    pub id: Uuid,
    pub data: Bytes,
    pub group: String,
    pub name: String,
    pub shoot_by: bool,
    pub strength: Option<u8>,
    pub walk_on: bool,
}