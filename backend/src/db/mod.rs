pub mod repository;

use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;

pub async fn create_pool() -> PgPool {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in environment / backend/.env");

    PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres database")
}
