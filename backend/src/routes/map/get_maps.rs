use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::IndexedResults;
use surrealdb::types::{RecordId, SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::BetterId;

#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct GetMapType {
    pub id: BetterId,
    pub name: String,
}

pub async fn get_maps_route(
    State(app_state): State<Arc<Mutex<AppState>>>
) -> Result<Json<Vec<GetMapType>>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let mut maps_result:IndexedResults = db.query("SELECT id, name from maps").await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let maps: Vec<GetMapType> = maps_result.take(0).map_err(|err| {
        println!("Error fetching maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;



    Ok(Json(maps))

}