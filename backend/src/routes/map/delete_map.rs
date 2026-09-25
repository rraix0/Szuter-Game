use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::types::{SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::{BetterId, IdConverter, MapType};


#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct DeleteMap {
    pub id: BetterId,
}


pub async fn delete_map_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<DeleteMap>
) -> Result<StatusCode, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let _:Option<MapType> = db
        .delete(data.id.convert())
        .await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;


    Ok(StatusCode::OK)


}