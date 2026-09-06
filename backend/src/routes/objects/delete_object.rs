use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{extract::{State}, Json};
use axum::http::StatusCode;
use serde::{Deserialize, Serialize};
use surrealdb::types::{RecordId, SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::{ObjectType};


#[derive(Deserialize, Serialize, Debug, Clone, SurrealValue)]
pub struct DeleteObject {
    pub id: RecordId
}


pub async fn delete_object_route(
    State(app_state): State<Arc<Mutex<AppState>>>,
    Json(data): Json<DeleteObject>
) -> Result<StatusCode, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let _:Option<ObjectType> = db
        .delete(data.id)
        .await.map_err(|err| {
        println!("Error selecting maps: {}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;


    Ok(StatusCode::OK)


}