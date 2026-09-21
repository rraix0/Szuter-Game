use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::types::{Bytes, RecordId, SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::{BetterId, ObjectType};


/*
#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct UpdateObjectData {
    pub data: Bytes,
    pub group: String,
    pub name: String,
    pub shoot_by: bool,
    pub strength: Option<i32>,
    pub walk_on: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct UpdateObject {
    #[serde(serialize_with = "serialize_id")]
    pub id: RecordId,
    pub data: UpdateObjectData

}

 */
pub async fn update_object_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<ObjectType>
) -> Result<Json<ObjectType>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let object:Option<ObjectType> = db
        .update(data.id.clone())
        .content(
            data
        )
        .await.map_err(|err| {
        println!("Error updating maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if let Some(object) = object {
        Ok(Json(object))
    } else {
        Err(StatusCode::BAD_REQUEST)
    }
}