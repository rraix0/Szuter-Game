use std::time::Duration;
use surrealdb::engine::any;
use surrealdb::engine::any::Any;
use surrealdb::opt::auth::{Database, Root};
use surrealdb::Surreal;
use tokio::time::sleep;
use std::env;
use surrealdb::engine::remote::ws::{Client, Ws};
use surrealdb::opt::Config;
pub async fn get_connection() -> Surreal<Client> {
    let db:Surreal<Client> = Surreal::init();

    loop {
        match db.connect::<Ws>(env::var("SURREAL_HOST").unwrap().as_str()).await {
            Ok(_) => {
                println!("Connected to SurrealDB");
                break;
            }
            Err(e) => {
                println!("Couldn't connect to database: {:?}", e);
                sleep(Duration::from_secs(5)).await;
            }
        }
    }
    loop {
        let user = Root { username: env::var("SURREAL_USERNAME").unwrap(), password: env::var("SURREAL_PASSWORD").unwrap()};

        match db.signin(user).await {
            Ok(_) => {
                println!("Successfully signed into SurrealDB!");
                break;
            }
            Err(e) => {
                println!("Couldn't connect to database: {:?}", e);
                sleep(Duration::from_secs(5)).await;
            }
        }
    }
    loop {
        match db.use_ns(env::var("SURREAL_NAMESPACE").unwrap()).use_db(env::var("SURREAL_DATABASE").unwrap()).await {
            Ok(_) => {
                println!("Successfully selected database and namespace!");
                break;
            }
            Err(e) => {
                println!("Couldn't connect to database: {:?}", e);
                sleep(Duration::from_secs(5)).await;
            }
        }
    }
    return db;
}