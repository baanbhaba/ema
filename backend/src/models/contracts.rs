use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DetectedStackItem {
    pub technology: String,
    pub version: String,
    pub status: String, // "current" | "deprecated" | "eol"
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeprecatedUsage {
    pub file: String,
    pub line: u32,
    pub pattern: String,
    pub recommended_replacement: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GraphEdge {
    pub from: String,
    pub to: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DependencyGraph {
    pub nodes: Vec<String>,
    pub edges: Vec<GraphEdge>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Diagram {
    pub r#type: String, // "class" | "component" | "sequence"
    pub format: String, // "mermaid"
    pub content: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CoreAudit {
    pub architecture_summary: String,
    pub detected_stack: Vec<DetectedStackItem>,
    pub deprecated_usages: Vec<DeprecatedUsage>,
    pub dependency_graph: DependencyGraph,
    pub diagrams: Vec<Diagram>,
    pub confidence: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiSurfaceItem {
    pub endpoint_or_interface: String,
    pub consumers: Vec<String>,
    pub breaking_change_risk: String, // "low" | "medium" | "high"
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImpactItem {
    pub component: Option<String>,
    pub file: Option<String>,
    pub risk: String,
    pub notes: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DependencyRisk {
    pub library: String,
    pub current_version: String,
    pub target_version: String,
    pub known_breaking_changes: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BlastRadiusItem {
    pub change: String,
    pub affected_files: Vec<String>,
    pub severity: String, // "low" | "medium" | "high"
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImpactAudit {
    pub api_surface: Vec<ApiSurfaceItem>,
    pub database_impacts: Vec<ImpactItem>,
    pub config_impacts: Vec<ImpactItem>,
    pub dependency_risks: Vec<DependencyRisk>,
    pub blast_radius: Vec<BlastRadiusItem>,
    pub confidence: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Conflict {
    pub topic: String,
    pub core_position: String,
    pub impact_position: String,
    pub resolved: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ConsensusResult {
    pub iteration: u32,
    pub conflicts: Vec<Conflict>,
    pub unified_confidence: f64,
    pub should_iterate_again: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReadinessScoreBreakdown {
    pub architecture_understanding: u32,
    pub dependency_resolution: u32,
    pub api_compatibility: u32,
    pub configuration_completeness: u32,
    pub migration_feasibility: u32,
    pub breaking_change_risk: u32,
    pub rollback_availability: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ReadinessScore {
    pub overall: u32,
    pub breakdown: ReadinessScoreBreakdown,
}
