use std::env;
use std::sync::Arc;
use serde::{Deserialize, Serialize};
use surrealdb::types::{SurrealValue};
use tokio::sync::Mutex;
use crate::types::all_types::SettingsType;
use crate::types::app_state::AppState;


#[derive(Clone, Debug, SurrealValue, Deserialize, Serialize)]
pub struct SettingsInit {
    pub admin_password: String,
}
pub async fn init_db(app_state: Arc<Mutex<AppState>>) -> Result<(), &'static str> {

    let db = app_state.lock().await.db.clone();

    let mut tables: Vec<String> = Vec::new();

    let maps = "
    DEFINE TABLE IF NOT EXISTS maps TYPE NORMAL SCHEMAFULL PERMISSIONS NONE;
    DEFINE FIELD IF NOT EXISTS id ON maps TYPE uuid;
    DEFINE FIELD IF NOT EXISTS name ON maps TYPE string;
    DEFINE FIELD IF NOT EXISTS data_background ON maps TYPE array<array<record<objects>>>;
    DEFINE FIELD IF NOT EXISTS data_background.* ON maps TYPE array<record<objects>>;
    DEFINE FIELD IF NOT EXISTS data_background.*.* ON maps TYPE record<objects>;
    DEFINE FIELD IF NOT EXISTS data_blocks ON maps TYPE array<array<record<objects>>>;
    DEFINE FIELD IF NOT EXISTS data_blocks.* ON maps TYPE array<record<objects>>;
    DEFINE FIELD IF NOT EXISTS data_blocks.*.* ON maps TYPE record<objects>;";
    tables.push(maps.to_string());

    let objects = "
        DEFINE TABLE IF NOT EXISTS objects TYPE NORMAL SCHEMAFULL PERMISSIONS NONE;
        DEFINE FIELD IF NOT EXISTS id ON objects TYPE uuid;
        DEFINE FIELD IF NOT EXISTS data ON objects TYPE bytes;
        DEFINE FIELD IF NOT EXISTS group ON objects TYPE string;
        DEFINE FIELD IF NOT EXISTS name ON objects TYPE string;
        DEFINE FIELD IF NOT EXISTS shoot_by ON objects TYPE bool;
        DEFINE FIELD IF NOT EXISTS strength ON objects TYPE none | int;
        DEFINE FIELD IF NOT EXISTS walk_on ON objects TYPE bool;
    ";
    tables.push(objects.to_string());

    let settings = "
    DEFINE TABLE IF NOT EXISTS settings TYPE NORMAL SCHEMAFULL PERMISSIONS NONE;
    DEFINE FIELD IF NOT EXISTS id ON settings TYPE int;
    DEFINE FIELD IF NOT EXISTS admin_password ON settings TYPE string;
    ";
    tables.push(settings.to_string());


    for table in tables.iter() {
        db.query(table).await.map_err(|err| {
            println!("Error executing query: {}", err);
            "Error while initializing db"
        })?;
    }
    println!("Successfully initialized db structure");



    let existing: Option<SettingsType> = db
        .select(("settings", 0))
        .await.map_err(|err| {
        println!("Error executing query: {}", err);
        "Error while initializing db"
    })?;

    if existing.is_none() {
        let _:Option<SettingsType> = db.create(("settings", 0))
            .content(SettingsInit {
                admin_password: env::var("DEFAULT_ADMIN_PASS").unwrap().to_string(),
            })
            .await.map_err(|err| {
            println!("Error executing query: {}", err);
            "Error while initializing db"
        })?;
    }

    Ok(())

}