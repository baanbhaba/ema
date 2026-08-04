mod agents;
mod models;

use agents::core_analysis::CoreAnalysisAgent;
use agents::impact_analysis::ImpactAnalysisAgent;
use axum::{
    extract::Json,
    http::StatusCode,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::env;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[derive(Deserialize)]
struct AnalyzeRequest {
    ingestion_manifest: String,
    deepseek_api_key: Option<String>,
    model: Option<String>,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/v1/health", get(health_check))
        .route("/api/v1/analyze/core", post(run_core_analysis))
        .route("/api/v1/analyze/impact", post(run_impact_analysis))
        .layer(cors);

    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse()
        .expect("PORT must be a number");

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    println!("🚀 EMA Rust Backend running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        service: "EMA Rust Orchestration Engine".to_string(),
        version: "1.0.0".to_string(),
    })
}

async fn run_core_analysis(
    Json(payload): Json<AnalyzeRequest>,
) -> Result<Json<models::contracts::CoreAudit>, (StatusCode, String)> {
    let api_key = payload
        .deepseek_api_key
        .or_else(|| env::var("DEEPSEEK_API_KEY").ok())
        .ok_or_else(|| (StatusCode::BAD_REQUEST, "Missing DEEPSEEK_API_KEY".to_string()))?;

    let agent = CoreAnalysisAgent::new(api_key, payload.model);

    match agent.analyze(&payload.ingestion_manifest).await {
        Ok(audit) => Ok(Json(audit)),
        Err(err) => Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string())),
    }
}

async fn run_impact_analysis(
    Json(payload): Json<AnalyzeRequest>,
) -> Result<Json<models::contracts::ImpactAudit>, (StatusCode, String)> {
    let api_key = payload
        .deepseek_api_key
        .or_else(|| env::var("DEEPSEEK_API_KEY").ok())
        .ok_or_else(|| (StatusCode::BAD_REQUEST, "Missing DEEPSEEK_API_KEY".to_string()))?;

    let agent = ImpactAnalysisAgent::new(api_key, payload.model);

    match agent.analyze(&payload.ingestion_manifest).await {
        Ok(audit) => Ok(Json(audit)),
        Err(err) => Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string())),
    }
}
