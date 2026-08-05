import { z } from "zod";

// --- Zod Schemas ---

export const DetectedStackItemSchema = z.object({
  technology: z.string(),
  version: z.string(),
  status: z.enum(["current", "deprecated", "eol"]),
});

export const DeprecatedUsageSchema = z.object({
  file: z.string(),
  line: z.number(),
  pattern: z.string(),
  recommended_replacement: z.string(),
});

export const DependencyGraphSchema = z.object({
  nodes: z.array(z.string()),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
    })
  ),
});

export const DiagramSchema = z.object({
  type: z.string(),
  format: z.string(),
  content: z.string(),
});

export const CoreAuditSchema = z.object({
  architecture_summary: z.string(),
  detected_stack: z.array(DetectedStackItemSchema),
  deprecated_usages: z.array(DeprecatedUsageSchema),
  dependency_graph: DependencyGraphSchema,
  diagrams: z.array(DiagramSchema),
  confidence: z.number().min(0).max(1),
});

export const ApiSurfaceItemSchema = z.object({
  endpoint_or_interface: z.string(),
  consumers: z.array(z.string()),
  breaking_change_risk: z.enum(["low", "medium", "high"]),
});

export const ImpactItemSchema = z.object({
  component: z.string().optional(),
  file: z.string().optional(),
  risk: z.string(),
  notes: z.string(),
});

export const DependencyRiskSchema = z.object({
  library: z.string(),
  current_version: z.string(),
  target_version: z.string(),
  known_breaking_changes: z.array(z.string()),
});

export const BlastRadiusItemSchema = z.object({
  change: z.string(),
  affected_files: z.array(z.string()),
  severity: z.enum(["low", "medium", "high"]),
});

export const ImpactAuditSchema = z.object({
  api_surface: z.array(ApiSurfaceItemSchema),
  database_impacts: z.array(ImpactItemSchema),
  config_impacts: z.array(ImpactItemSchema),
  dependency_risks: z.array(DependencyRiskSchema),
  blast_radius: z.array(BlastRadiusItemSchema),
  confidence: z.number().min(0).max(1),
});

export const ConflictSchema = z.object({
  topic: z.string(),
  core_position: z.string(),
  impact_position: z.string(),
  resolved: z.boolean(),
});

export const ConsensusResultSchema = z.object({
  iteration: z.number(),
  conflicts: z.array(ConflictSchema),
  unified_confidence: z.number().min(0).max(1),
  should_iterate_again: z.boolean(),
});

export const ReadinessScoreBreakdownSchema = z.object({
  architecture_understanding: z.number(), // weight 20%
  dependency_resolution: z.number(),      // weight 15%
  api_compatibility: z.number(),          // weight 15%
  configuration_completeness: z.number(), // weight 10%
  migration_feasibility: z.number(),      // weight 20%
  breaking_change_risk: z.number(),       // weight 15% (inverted — higher is safer)
  rollback_availability: z.number(),      // weight 5%
});

export const ReadinessScoreSchema = z.object({
  overall: z.number().min(0).max(100),
  breakdown: ReadinessScoreBreakdownSchema,
});

export const BlueprintStepStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const BlueprintStepSchema = z.object({
  id: z.string(),
  file_or_module: z.string(),
  what_changes: z.string(),
  why: z.string(),
  target_pattern: z.string(),
  risk_level: z.enum(["low", "medium", "high"]),
  depends_on: z.array(z.string()),
  status: BlueprintStepStatusSchema,
  rejection_reason: z.string().optional(),
});

export const BlueprintSchema = z.object({
  project_id: z.string(),
  steps: z.array(BlueprintStepSchema),
});

export const ValidationResultSchema = z.object({
  unit: z.string(),
  build_status: z.enum(["pass", "fail"]),
  tests_run: z.number(),
  tests_passed: z.number(),
  lint_issues: z.array(z.string()),
  coverage_note: z.string(),
});

export const MigrationReportEntrySchema = z.object({
  unit: z.string(),
  diff: z.string(),
  validation: ValidationResultSchema,
  approved_by: z.string(),
  approved_at: z.string(),
});

export const MigrationReportSchema = z.object({
  project_id: z.string(),
  core_audit: CoreAuditSchema,
  impact_audit: ImpactAuditSchema,
  blueprint: BlueprintSchema,
  entries: z.array(MigrationReportEntrySchema),
  rollback_plan: z.string(),
});

export const ProjectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  repo_url: z.string(),
  stage: z.enum([
    "ingesting",
    "analyzing",
    "awaiting_approval",
    "transforming",
    "validating",
    "done",
  ]),
  readiness_score: z.number().optional(), // 0-100
  last_updated: z.string(), // ISO string
  java_from: z.string().default("Java 8"),
  java_to: z.string().default("Java 21"),
});

// --- TypeScript Types Inferred from Zod ---

export type DetectedStackItem = z.infer<typeof DetectedStackItemSchema>;
export type DeprecatedUsage = z.infer<typeof DeprecatedUsageSchema>;
export type DependencyGraph = z.infer<typeof DependencyGraphSchema>;
export type Diagram = z.infer<typeof DiagramSchema>;
export type CoreAudit = z.infer<typeof CoreAuditSchema>;

export type ApiSurfaceItem = z.infer<typeof ApiSurfaceItemSchema>;
export type ImpactItem = z.infer<typeof ImpactItemSchema>;
export type DependencyRisk = z.infer<typeof DependencyRiskSchema>;
export type BlastRadiusItem = z.infer<typeof BlastRadiusItemSchema>;
export type ImpactAudit = z.infer<typeof ImpactAuditSchema>;

export type Conflict = z.infer<typeof ConflictSchema>;
export type ConsensusResult = z.infer<typeof ConsensusResultSchema>;
export type ReadinessScoreBreakdown = z.infer<typeof ReadinessScoreBreakdownSchema>;
export type ReadinessScore = z.infer<typeof ReadinessScoreSchema>;

export type BlueprintStepStatus = z.infer<typeof BlueprintStepStatusSchema>;
export type BlueprintStep = z.infer<typeof BlueprintStepSchema>;
export type Blueprint = z.infer<typeof BlueprintSchema>;

export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type MigrationReportEntry = z.infer<typeof MigrationReportEntrySchema>;
export type MigrationReport = z.infer<typeof MigrationReportSchema>;
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
