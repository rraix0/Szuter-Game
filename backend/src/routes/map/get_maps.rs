use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use tokio::sync::Mutex;
use crate::types::all_types::MapType;

pub async fn get_maps_route(
    State(app_state): State<Arc<Mutex<AppState>>>
) -> Result<Json<Vec<MapType>>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let maps:Vec<MapType> = db.select("maps").await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(maps))

}