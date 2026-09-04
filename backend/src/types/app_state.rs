use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;

#[derive(Clone)]
pub struct AppState {
    pub db:Surreal<Client>
}