use std::sync::Arc;
use crate::types::app_state::AppState;
use axum::{Router, routing::get, extract::{State, FromRef}, Json};
use axum::http::StatusCode;
use tokio::sync::Mutex;
use crate::types::all_types::Maps;

pub async fn get_maps_route(
    State(app_state): State<Arc<Mutex<AppState>>>
) -> Result<Json<Vec<String>>, StatusCode>  {

    let db = app_state.lock().await.db.clone();

    let test_x:Vec<Maps> = db.select("maps").await.unwrap();

    let test_x = db.query("select * from maps").await.unwrap();

    // get all data, send to user;l

    println!("{:?}", test_x);
    //let result: Vec<Maps> = db.select("maps").await.unwrap();


    Err(StatusCode::INTERNAL_SERVER_ERROR)
}