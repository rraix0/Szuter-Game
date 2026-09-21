use dotenvy::dotenv;
use std::sync::Arc;
use ::surrealdb::engine::remote::ws::Client;
use ::surrealdb::Surreal;
use axum::{Router, middleware};
use axum::http::{HeaderName, Method};
use axum::routing::{any, get, post};
use tokio::sync::Mutex;
use tower_http::cors::{AllowOrigin, Any, CorsLayer};

mod surrealdb;
mod routes;
mod types;
mod auth;
mod websockets;

use crate::{
    auth::admin_auth::admin_auth,
    routes::{
        map::{
            create_map::create_map_route,
            delete_map::delete_map_route,
            get_map::get_map_route,
            get_maps::get_maps_route,
            update_map::update_map_route,
        },
        objects::{
            create_object::create_object_route,
            delete_object::delete_object_route,
            get_objects::get_object_route,
            update_object::update_object_route,
        },
    },
    surrealdb::{
        get_connection::get_connection,
        surreal_init::init_db,
    },
    types::app_state::AppState,
};
use crate::websockets::main::ws_handler;
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
        .route(&format!("{}{}", &api_path, "/get_map"), post(get_map_route))
        .route(&format!("{}{}", &api_path, "/create_map"), post(create_map_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))
        .route(&format!("{}{}", &api_path, "/update_map"), post(update_map_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))
        .route(&format!("{}{}", &api_path, "/delete_map"), post(delete_map_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))

        .route(&format!("{}{}", &api_path, "/get_objects"), get(get_object_route))
        .route(&format!("{}{}", &api_path, "/create_object"), post(create_object_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))
        .route(&format!("{}{}", &api_path, "/delete_object"), post(delete_object_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))
        .route(&format!("{}{}", &api_path, "/update_object"), post(update_object_route) .layer(middleware::from_fn_with_state(shared_state.clone(), admin_auth)))

        .layer(
            CorsLayer::new()
                .allow_methods([Method::POST, Method::GET, Method::OPTIONS])
                .allow_headers([
                    HeaderName::from_static("content-type"),
                    HeaderName::from_static("authorization"),
                ])
                .allow_origin(Any)
          )
        .route(&format!("{}{}", &api_path, "/ws"), any(ws_handler))

        .with_state(shared_state);


    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();

    println!("Listening on http://0.0.0.0:8000");
    axum::serve(listener, app).await.unwrap();


}
