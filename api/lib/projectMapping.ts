const STAGE_TO_PIPELINE: Record<string, string> = {
  core_audit: "analyzing",
  readiness: "awaiting_approval",
  blueprint: "transforming",
  ingesting: "ingesting",
  analyzing: "analyzing",
  awaiting_approval: "awaiting_approval",
  transforming: "transforming",
  validating: "validating",
  done: "done",
};

export function mapProjectStage(stage: string | null | undefined): string {
  return STAGE_TO_PIPELINE[stage || ""] || "ingesting";
}

export function mapProjectToSummary(project: any) {
  return {
    id: project.id,
    name: project.name,
    repo_url: project.repoUrl || "N/A",
    stage: mapProjectStage(project.stage),
    readiness_score:
      typeof project.readinessScore === "number" ? project.readinessScore : undefined,
    last_updated: project.updatedAt
      ? new Date(project.updatedAt).toISOString()
      : new Date().toISOString(),
    java_from: project.java_from || "Java 8",
    java_to: project.java_to || "Java 21",
  };
}
