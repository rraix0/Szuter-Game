use std::sync::Arc;
use axum::{
    extract::Request,
    http::{header, StatusCode},
    middleware::{Next},
    response::{Response},
};
use axum::extract::State;
use tokio::sync::Mutex;
use crate::types::all_types::SettingsType;
use crate::types::app_state::AppState;

pub async fn admin_auth(
    State(app_state): State<Arc<Mutex<AppState>>>,
    req: Request,
    next: Next
) -> Result<Response, StatusCode> {
    let db = app_state.lock().await.db.clone();

    let auth_header = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;
    let settings: Option<SettingsType> = db.select(("settings", 0)).await.map_err(|err| {
        println!("{}", err);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    if let Some(settings) = settings {
        if auth_header == settings.admin_password {
            Ok(next.run(req).await)
        } else {
            Err(StatusCode::UNAUTHORIZED)
        }
    } else {
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }

}