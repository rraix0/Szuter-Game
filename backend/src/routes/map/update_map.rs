use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use tokio::sync::Mutex;
use crate::types::all_types::{MapType};



pub async fn update_map_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<MapType>
) -> Result<Json<MapType>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let map:Option<MapType> = db
        .update(data.id.clone())
        .content(
            data
        )
        .await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if let Some(map) = map {
        Ok(Json(map))
    } else {
        Err(StatusCode::BAD_REQUEST)
    }
}