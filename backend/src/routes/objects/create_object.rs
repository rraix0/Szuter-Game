use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::types::{Bytes, SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::{ObjectType};


#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct CreateObject {
    pub data: Bytes,
    pub group: String,
    pub name: String,
    pub shoot_by: bool,
    pub strength: Option<i32>,
    pub walk_on: bool,
}


pub async fn create_object_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<CreateObject>
) -> Result<Json<ObjectType>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let objects:Vec<ObjectType> = db
        .insert("objects")
        .content(
            CreateObject {
                data: data.data,
                group: data.group,
                name: data.name,
                shoot_by: data.shoot_by,
                strength: data.strength,
                walk_on: data.walk_on,
            }
        )
        .await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if !objects.is_empty() && objects.len() == 1 {
        let object = objects.get(0).unwrap();
        Ok(Json(object.clone()))
    } else {
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}