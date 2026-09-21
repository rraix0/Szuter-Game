use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::types::{RecordId, SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::{MapType};


#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct CreateMap {
    pub name: String,
    pub data_background: Vec<Vec<RecordId>>,
    pub data_blocks: Vec<Vec<RecordId>>,
}


pub async fn create_map_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<CreateMap>
) -> Result<Json<MapType>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let maps:Vec<MapType> = db
        .insert("maps")
        .content(
            data
        )
        .await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if !maps.is_empty() && maps.len() == 1 {
        let map = maps.get(0).unwrap();
        Ok(Json(map.clone()))
    } else {
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}