use std::str::FromStr;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use surrealdb::types::{Bytes, RecordId, RecordIdKey, SurrealValue, Table, Uuid};


fn serialize_id<S>(id: &RecordId, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let table: String = id.table.to_string();
    let uuid: Uuid = match id.key {
        RecordIdKey::Uuid(uuid) => uuid,
        _ => return Err(serde::ser::Error::custom("Cannot serialize UUID"))?,
    };
    let better_id = format!("{}:{}", table, uuid);
    serializer.serialize_str(&better_id)
}

fn deserialize_id<'de, D>(deserializer: D) -> Result<RecordId, D::Error>
where
    D: Deserializer<'de>,
{
    let id = String::deserialize(deserializer)?;

    let (table, uuid) = id
        .split_once(':').ok_or(serde::de::Error::custom("Cannot deserialize UUID"))?;
    let table: Table = Table::from(table);
    let record_id_key: RecordIdKey = RecordIdKey::Uuid(Uuid::from_str(uuid).map_err(serde::de::Error::custom)?);
    let record_id = RecordId::new(table, record_id_key);
    Ok(record_id)
}

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct BetterId(
    #[serde(serialize_with = "serialize_id", deserialize_with = "deserialize_id")] pub RecordId,
);

pub trait IdConverter {
    fn convert(self) -> RecordId;
}

impl IdConverter for BetterId {
    fn convert(self) -> RecordId {
        self.0
    }
}

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct MapType {
    #[serde(serialize_with = "serialize_id", deserialize_with = "deserialize_id")]
    pub id: RecordId,
    pub name: String,
    pub data_background: Vec<Vec<BetterId>>,
    pub data_blocks: Vec<Vec<BetterId>>,
}

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct ObjectType {
    #[serde(serialize_with = "serialize_id", deserialize_with = "deserialize_id")]
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
    #[serde(serialize_with = "serialize_id", deserialize_with = "deserialize_id")]
    pub id: RecordId,
    pub admin_password: String,
}
