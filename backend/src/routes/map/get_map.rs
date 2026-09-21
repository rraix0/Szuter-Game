use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

use surrealdb::types::{RecordId, SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::MapType;

#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct GetMapData {
    pub id: RecordId
}



pub async fn get_map_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<GetMapData>
) -> Result<Json<MapType>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let map: Option<MapType> = db.select(data.id).await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if let Some(map) = map {
        Ok(Json(map))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}