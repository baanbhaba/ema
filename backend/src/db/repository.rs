use crate::models::contracts::{CoreAudit, ImpactAudit};
use sqlx::PgPool;
use uuid::Uuid;

/// Persist a CoreAudit result to the `core_audits` table.
/// Uses upsert so repeated runs update the existing row.
pub async fn upsert_core_audit(
    pool: &PgPool,
    project_id: &str,
    audit: &CoreAudit,
) -> Result<(), sqlx::Error> {
    let id = Uuid::new_v4().to_string();
    let detected_stack = serde_json::to_value(&audit.detected_stack).unwrap_or_default();
    let deprecated_usages = serde_json::to_value(&audit.deprecated_usages).unwrap_or_default();
    let dependency_graph = serde_json::to_value(&audit.dependency_graph).unwrap_or_default();
    let diagrams = serde_json::to_value(&audit.diagrams).unwrap_or_default();

    sqlx::query(
        r#"
        INSERT INTO core_audits (
            id, "projectId", "architectureSummary",
            "detectedStack", "deprecatedUsages", "dependencyGraph",
            diagrams, confidence, "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT ("projectId") DO UPDATE SET
            "architectureSummary" = EXCLUDED."architectureSummary",
            "detectedStack"       = EXCLUDED."detectedStack",
            "deprecatedUsages"    = EXCLUDED."deprecatedUsages",
            "dependencyGraph"     = EXCLUDED."dependencyGraph",
            diagrams              = EXCLUDED.diagrams,
            confidence            = EXCLUDED.confidence,
            "updatedAt"           = NOW()
        "#,
    )
    .bind(id)
    .bind(project_id)
    .bind(&audit.architecture_summary)
    .bind(detected_stack)
    .bind(deprecated_usages)
    .bind(dependency_graph)
    .bind(diagrams)
    .bind(audit.confidence)
    .execute(pool)
    .await?;

    Ok(())
}

/// Persist an ImpactAudit result to the `impact_audits` table.
pub async fn upsert_impact_audit(
    pool: &PgPool,
    project_id: &str,
    audit: &ImpactAudit,
) -> Result<(), sqlx::Error> {
    let id = Uuid::new_v4().to_string();
    let api_surface = serde_json::to_value(&audit.api_surface).unwrap_or_default();
    let database_impacts = serde_json::to_value(&audit.database_impacts).unwrap_or_default();
    let config_impacts = serde_json::to_value(&audit.config_impacts).unwrap_or_default();
    let dependency_risks = serde_json::to_value(&audit.dependency_risks).unwrap_or_default();
    let blast_radius = serde_json::to_value(&audit.blast_radius).unwrap_or_default();

    sqlx::query(
        r#"
        INSERT INTO impact_audits (
            id, "projectId", "apiSurface",
            "databaseImpacts", "configImpacts", "dependencyRisks",
            "blastRadius", confidence, "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT ("projectId") DO UPDATE SET
            "apiSurface"       = EXCLUDED."apiSurface",
            "databaseImpacts"  = EXCLUDED."databaseImpacts",
            "configImpacts"    = EXCLUDED."configImpacts",
            "dependencyRisks"  = EXCLUDED."dependencyRisks",
            "blastRadius"      = EXCLUDED."blastRadius",
            confidence         = EXCLUDED.confidence,
            "updatedAt"        = NOW()
        "#,
    )
    .bind(id)
    .bind(project_id)
    .bind(api_surface)
    .bind(database_impacts)
    .bind(config_impacts)
    .bind(dependency_risks)
    .bind(blast_radius)
    .bind(audit.confidence)
    .execute(pool)
    .await?;

    Ok(())
}

/// Mark a project's stage after analysis completes.
/// The readiness score is left untouched — it is computed by the
/// canonical serverless readiness engine, not hardcoded here.
pub async fn update_project_stage(
    pool: &PgPool,
    project_id: &str,
    stage: &str,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        UPDATE projects
        SET stage = $1, "updatedAt" = NOW()
        WHERE id = $2
        "#,
    )
    .bind(stage)
    .bind(project_id)
    .execute(pool)
    .await?;

    Ok(())
}
