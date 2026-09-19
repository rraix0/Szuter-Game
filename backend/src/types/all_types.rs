use serde::{Deserialize, Serialize};
use surrealdb::types::{Bytes, RecordId, SurrealValue};

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct MapType {
    pub id: RecordId,
    pub name: String,
    pub data_background: Vec<Vec<RecordId>>,
    pub data_blocks: Vec<Vec<RecordId>>,
}

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct ObjectType {
    pub id: RecordId,
    pub data: Bytes,
    pub group: String,
    pub name: String,
    pub shoot_by: bool,
    pub strength: Option<u8>,
    pub walk_on: bool,
}

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct SettingsType {
    pub id: RecordId,
    pub admin_password: String,
}
