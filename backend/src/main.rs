use dotenvy::dotenv;
use std::sync::Arc;
use ::surrealdb::engine::remote::ws::Client;
use ::surrealdb::Surreal;
use axum::{Router, middleware};
use axum::routing::{any, get, post};
use tokio::sync::Mutex;

mod surrealdb;
mod routes;
mod types;
mod auth;
mod websockets;

use crate::surrealdb::get_connection::get_connection;
use routes::{
    map::{
        get_maps::get_maps_route
    },
    objects:: {
        create_object::create_object_route
    }
};
use crate::auth::admin_auth::admin_auth;
use crate::routes::objects::delete_object::delete_object_route;
use crate::routes::objects::get_objects::get_object_route;
use crate::routes::objects::update_object::update_object_route;
use crate::surrealdb::surreal_init::init_db;
use crate::types::app_state::AppState;
use crate::websockets::main::ws_handler;

// our router
async fn root() -> &'static str {
    "TEST"
}



#[tokio::main]
async fn main() {
    dotenv().ok();

    let api_path = "/api/v1";

    let db:Surreal<Client> = get_connection().await;



    let shared_state = Arc::new(Mutex::new(AppState { db, players: None}));
    init_db(Arc::clone(&shared_state)).await.unwrap();

    let app = Router::new()
        .route(&format!("{}{}", &api_path, ""), post(|| async { "no elo" }))
        .route(&format!("{}{}", &api_path, "/get_maps"), get(get_maps_route))// done
        .route(&format!("{}{}", &api_path, "/get_map"), post(root))
        .route(&format!("{}{}", &api_path, "/create_map"), post(root))
        .route(&format!("{}{}", &api_path, "/update_map"), post(root))

        .route(&format!("{}{}", &api_path, "/get_objects"), get(get_object_route))
        .route(&format!("{}{}", &api_path, "/create_object"), post(create_object_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))
        .route(&format!("{}{}", &api_path, "/delete_object"), post(delete_object_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))
        .route(&format!("{}{}", &api_path, "/update_object"), post(update_object_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))

        .route(&format!("{}{}", &api_path, "/ws"), any(ws_handler))

        .with_state(shared_state);


    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    println!("Listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();


}
