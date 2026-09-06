use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use tokio::sync::Mutex;
use crate::types::all_types::{ObjectType};

pub async fn get_object_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
) -> Result<Json<Vec<ObjectType>>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let objects:Vec<ObjectType> = db
        .select("objects")
        .await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(objects.clone()))
}