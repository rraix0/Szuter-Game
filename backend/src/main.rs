use dotenvy::dotenv;
use std::sync::Arc;
use ::surrealdb::engine::remote::ws::Client;
use ::surrealdb::Surreal;
use tokio::main;
use axum::{Router, routing::get};
use axum::extract::State;
use axum::routing::post;
use tokio::sync::Mutex;

mod surrealdb;
mod routes;
mod types;
use crate::surrealdb::get_connection::get_connection;
use routes::{
    map::{
        get_maps
    }
};
use crate::routes::map::get_maps::get_maps_route;
use crate::types::app_state::AppState;

// our router
async fn root() -> &'static str {
    "TEST"
}



#[tokio::main]
async fn main() {
    dotenv().ok();

    let api_path = "/api/v1";

    let db:Surreal<Client> = get_connection().await;

    let shared_state = Arc::new(Mutex::new(AppState { db}));

    let app = Router::new()
        .route(&format!("{}{}", &api_path, ""), post(|| async { "no elo" }))
        .route(&format!("{}{}", &api_path, "/get_maps"), post(get_maps_route))
        .route(&format!("{}{}", &api_path, "/get_map"), post(root))
        .route(&format!("{}{}", &api_path, "/create_map"), post(root))
        .route(&format!("{}{}", &api_path, "/update_map"), post(root))
        .with_state(shared_state);
        ;

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    println!("Listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();


}
