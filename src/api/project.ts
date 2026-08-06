import type {
  ProjectSummary,
  CoreAudit,
  ImpactAudit,
  ConsensusResult,
  ReadinessScore,
  Conflict,
  Blueprint,
} from "../types/contracts";
import {
  ProjectSummarySchema,
  CoreAuditSchema,
  ImpactAuditSchema,
  ConsensusResultSchema,
  ReadinessScoreSchema,
} from "../types/contracts";
import { fetchApi } from "./client";
import {
  MOCK_CORE_AUDITS,
  MOCK_IMPACT_AUDITS,
  MOCK_CONSENSUS,
  MOCK_READINESS_SCORES,
} from "./mockData";
import { analyzeCoreWithNvidia, analyzeImpactWithNvidia } from "./nvidiaEngine";
import { useAuthStore } from "../store/useAuthStore";

import { MOCK_PROJECTS } from "./mockData";

let localProjectsStore: Record<string, ProjectSummary> = MOCK_PROJECTS.reduce(
  (acc, proj) => ({ ...acc, [proj.id]: proj }),
  {}
);
let sourceCodeStore: Record<string, string> = {};
let liveCoreAudits: Record<string, CoreAudit> = {};
let liveImpactAudits: Record<string, ImpactAudit> = {};

const getPersistedSourceCode = (projectId: string): string => {
  if (sourceCodeStore[projectId]) return sourceCodeStore[projectId];
  try {
    const raw = sessionStorage.getItem("ema_source_code_store");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[projectId]) {
        sourceCodeStore[projectId] = parsed[projectId];
        return parsed[projectId];
      }
    }
  } catch (_e) {}
  return "";
};

const savePersistedSourceCode = (projectId: string, code: string) => {
  sourceCodeStore[projectId] = code;
  try {
    const raw = sessionStorage.getItem("ema_source_code_store") || "{}";
    const parsed = JSON.parse(raw);
    parsed[projectId] = code;
    sessionStorage.setItem("ema_source_code_store", JSON.stringify(parsed));
  } catch (_e) {}
};

export const getProjects = async (): Promise<ProjectSummary[]> => {
  const { isDevMode } = useAuthStore.getState();

  // If in dev mode (user 'baanbhaba'), bypass backend rerouting entirely and use client state
  if (isDevMode) {
    return Object.values(localProjectsStore).map((p) => ProjectSummarySchema.parse(p));
  }

  try {
    const data = await fetchApi<ProjectSummary[]>("/projects");
    return data.map((item) => ProjectSummarySchema.parse(item));
  } catch (_err) {
    console.warn("[MOCK_FALLBACK] Backend /projects endpoint unavailable; returning local projects.");
    return Object.values(localProjectsStore).map((p) => ProjectSummarySchema.parse(p));
  }
};

export const createProject = async (data: {
  name: string;
  repo_url: string;
  javaCode?: string;
}): Promise<ProjectSummary> => {
  const { isDevMode } = useAuthStore.getState();

  const id = `proj-${Date.now().toString(36)}`;
  const newSummary: ProjectSummary = {
    id,
    name: data.name,
    repo_url: data.repo_url || "N/A",
    stage: "ingesting",
    readiness_score: 90,
    last_updated: new Date().toISOString(),
    java_from: "Java 8",
    java_to: "Java 21 / Rust Axum",
  };
  localProjectsStore[id] = newSummary;

  const codeToSave = (data.javaCode && data.javaCode.trim().length > 0)
    ? data.javaCode
    : `public class ${data.name.replace(/\s+/g, "")} {\n    public static void main(String[] args) {\n        System.out.println("Executing ${data.name}");\n    }\n}`;

  savePersistedSourceCode(id, codeToSave);

  if (isDevMode) {
    return ProjectSummarySchema.parse(newSummary);
  }

  try {
    const res = await fetchApi<ProjectSummary>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return ProjectSummarySchema.parse(res);
  } catch (_err) {
    console.warn("[MOCK_FALLBACK] Backend /projects POST endpoint unavailable; creating project in local state.");
    return ProjectSummarySchema.parse(newSummary);
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  const { isDevMode } = useAuthStore.getState();

  delete localProjectsStore[projectId];
  delete sourceCodeStore[projectId];
  delete liveCoreAudits[projectId];
  delete liveImpactAudits[projectId];

  if (isDevMode) {
    return true;
  }

  try {
    await fetchApi<{ success: boolean }>(`/projects/${projectId}`, {
      method: "DELETE",
    });
    return true;
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend DELETE /projects/${projectId} endpoint unavailable; removing from local state.`);
    return true;
  }
};

export const getProjectSourceCode = (projectId: string): Record<string, string> => {
  const code = getPersistedSourceCode(projectId);
  if (code) {
    return { "Main.java": code };
  }
  return {};
};

export const getCoreAudit = async (projectId: string): Promise<CoreAudit> => {
  const { isDevMode } = useAuthStore.getState();

  // If live core audit cached, return it
  if (liveCoreAudits[projectId]) {
    return liveCoreAudits[projectId];
  }

  // If logged in as 'baanbhaba', run live NVIDIA AI Core Analysis
  if (isDevMode) {
    const proj = localProjectsStore[projectId];
    const name = proj?.name || "Uploaded Project";
    const code = getPersistedSourceCode(projectId);
    const aiResult = await analyzeCoreWithNvidia(name, code);
    if (aiResult) {
      liveCoreAudits[projectId] = CoreAuditSchema.parse(aiResult);
      return liveCoreAudits[projectId];
    }
  }

  try {
    const data = await fetchApi<CoreAudit>("/analyze/core", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
    return CoreAuditSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend /analyze/core endpoint unavailable for project ${projectId}; returning audit.`);
    const proj = localProjectsStore[projectId];
    const mock = MOCK_CORE_AUDITS[projectId] || {
      architecture_summary: `Architecture analysis for ${proj?.name || "Uploaded Project"}. Legacy Java Spring Boot application ready for Java 21 migration.`,
      detected_stack: [
        { technology: "Java", version: "1.8.0", status: "eol" },
        { technology: "Spring Boot", version: "2.4.0", status: "eol" },
      ],
      deprecated_usages: [
        {
          file: `${proj?.name || "Main"}.java`,
          line: 15,
          pattern: "javax.persistence.*",
          recommended_replacement: "jakarta.persistence.*",
        },
      ],
      dependency_graph: {
        nodes: [proj?.name || "Application", "ServiceModule", "RepositoryModule"],
        edges: [
          { from: proj?.name || "Application", to: "ServiceModule" },
          { from: "ServiceModule", to: "RepositoryModule" },
        ],
      },
      diagrams: [
        {
          type: "component",
          format: "mermaid",
          content: `graph TD\n  App[${proj?.name || "Java 8 App"}] --> Target[Java 21 / Rust Axum Target]`,
        },
      ],
      confidence: 0.90,
    };
    return CoreAuditSchema.parse(mock);
  }
};

export const getImpactAudit = async (projectId: string): Promise<ImpactAudit> => {
  const { isDevMode } = useAuthStore.getState();

  // If live impact audit cached, return it
  if (liveImpactAudits[projectId]) {
    return liveImpactAudits[projectId];
  }

  // If logged in as 'baanbhaba', run live NVIDIA AI Impact Analysis
  if (isDevMode) {
    const proj = localProjectsStore[projectId];
    const name = proj?.name || "Uploaded Project";
    const code = getPersistedSourceCode(projectId);
    const aiResult = await analyzeImpactWithNvidia(name, code);
    if (aiResult) {
      liveImpactAudits[projectId] = ImpactAuditSchema.parse(aiResult);
      return liveImpactAudits[projectId];
    }
  }

  try {
    const data = await fetchApi<ImpactAudit>("/analyze/impact", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
    return ImpactAuditSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend /analyze/impact endpoint unavailable for project ${projectId}; returning impact analysis.`);
    const proj = localProjectsStore[projectId];
    const mock = MOCK_IMPACT_AUDITS[projectId] || {
      api_surface: [
        {
          endpoint_or_interface: `API Surface (${proj?.name || "Service"})`,
          consumers: ["Frontend Clients"],
          breaking_change_risk: "medium",
        },
      ],
      database_impacts: [
        {
          component: "JPA / Hibernate Dialect",
          risk: "medium",
          notes: "Upgrade from Hibernate 5 to 6 requiring Jakarta EE namespace update.",
        },
      ],
      config_impacts: [
        {
          component: "Application Configuration",
          risk: "low",
          notes: "Migrate application.properties to Spring Boot 3 format.",
        },
      ],
      dependency_risks: [
        {
          library: "Spring Web",
          current_version: "2.4.0",
          target_version: "3.2.0",
          known_breaking_changes: ["javax.servlet to jakarta.servlet package relocation"],
        },
      ],
      blast_radius: [
        {
          change: `Migrate ${proj?.name || "Project"} to Java 21 / Axum`,
          affected_files: [`${proj?.name || "Service"}.java`],
          severity: "medium",
        },
      ],
      confidence: 0.88,
    };
    return ImpactAuditSchema.parse(mock);
  }
};

export function calculateDynamicReadinessScore(
  coreAudit?: CoreAudit | null,
  impactAudit?: ImpactAudit | null,
  blueprint?: Blueprint | null
): ReadinessScore {
  const deprecatedUsages = coreAudit?.deprecated_usages || [];
  const detectedStack = coreAudit?.detected_stack || [];
  const deprecatedCount = deprecatedUsages.length;
  const eolCount = detectedStack.filter((s) => s.status === "eol").length;
  const deprecatedStackCount = detectedStack.filter((s) => s.status === "deprecated").length;

  const apiSurface = impactAudit?.api_surface || [];
  const highRiskApi = apiSurface.filter((a) => a.breaking_change_risk === "high").length;
  const medRiskApi = apiSurface.filter((a) => a.breaking_change_risk === "medium").length;

  const configImpacts = impactAudit?.config_impacts || [];
  const highRiskConfig = configImpacts.filter((c) => c.risk === "high").length;
  const medRiskConfig = configImpacts.filter((c) => c.risk === "medium").length;

  const dependencyRisks = impactAudit?.dependency_risks || [];

  const blastRadius = impactAudit?.blast_radius || [];
  const highSeverityBlast = blastRadius.filter((b) => b.severity === "high").length;
  const medSeverityBlast = blastRadius.filter((b) => b.severity === "medium").length;

  const dbImpacts = impactAudit?.database_impacts || [];
  const highDbRisk = dbImpacts.filter((d) => d.risk === "high").length;

  const steps = blueprint?.steps || [];
  const approvedSteps = steps.filter((s) => s.status === "approved").length;
  const rejectedSteps = steps.filter((s) => s.status === "rejected").length;

  const architecture_understanding = Math.max(50, Math.min(100, 96 - deprecatedCount * 4 - eolCount * 5 - deprecatedStackCount * 2));
  const dependency_resolution = Math.max(40, Math.min(100, 95 - dependencyRisks.length * 8 - eolCount * 6 - deprecatedStackCount * 3));
  const api_compatibility = Math.max(40, Math.min(100, 98 - highRiskApi * 15 - medRiskApi * 6));
  const configuration_completeness = Math.max(50, Math.min(100, 94 - highRiskConfig * 12 - medRiskConfig * 5));
  const migration_feasibility = Math.max(30, Math.min(100, 88 + approvedSteps * 4 - rejectedSteps * 10));
  const breaking_change_risk = Math.max(30, Math.min(100, 95 - highSeverityBlast * 15 - medSeverityBlast * 6));
  const rollback_availability = Math.max(50, Math.min(100, 96 - highDbRisk * 10));

  const overall = Math.round(
    architecture_understanding * 0.20 +
    migration_feasibility * 0.20 +
    dependency_resolution * 0.15 +
    api_compatibility * 0.15 +
    breaking_change_risk * 0.15 +
    configuration_completeness * 0.10 +
    rollback_availability * 0.05
  );

  return {
    overall,
    breakdown: {
      architecture_understanding,
      dependency_resolution,
      api_compatibility,
      configuration_completeness,
      migration_feasibility,
      breaking_change_risk,
      rollback_availability,
    },
  };
}

export function calculateDynamicConsensus(
  coreAudit?: CoreAudit | null,
  impactAudit?: ImpactAudit | null,
  primaryFile: string = "Main.java"
): ConsensusResult {
  const conflicts: Conflict[] = [];

  const apiSurface = impactAudit?.api_surface || [];
  const depUsages = coreAudit?.deprecated_usages || [];
  const depRisks = impactAudit?.dependency_risks || [];
  const dbImpacts = impactAudit?.database_impacts || [];

  const primaryApi = apiSurface[0]?.endpoint_or_interface || primaryFile;
  const apiRisk = apiSurface[0]?.breaking_change_risk || "low";

  conflicts.push({
    topic: `Target Migration Pattern & API Contract for ${primaryApi}`,
    core_position: `Convert ${primaryFile} structures and endpoints to native Rust Axum async handlers.`,
    impact_position: `Ensure zero breaking API contract changes for downstream consumers (${apiRisk.toUpperCase()} risk detected).`,
    resolved: apiRisk !== "high",
  });

  if (depUsages.length > 0 || depRisks.length > 0) {
    const mainPattern = depUsages[0]?.pattern || depRisks[0]?.library || "Legacy Dependencies";
    const replacement = depUsages[0]?.recommended_replacement || depRisks[0]?.target_version || "Updated Crates/Packages";
    conflicts.push({
      topic: `Modernization Strategy: ${mainPattern}`,
      core_position: `Refactor legacy calls from '${mainPattern}' to '${replacement}'.`,
      impact_position: `Verify backward compatibility and non-breaking upgrade paths across all dependents.`,
      resolved: depRisks.length === 0 || !depRisks.some((d) => d.known_breaking_changes.length > 1),
    });
  }

  if (dbImpacts.length > 0) {
    const dbComp = dbImpacts[0].component || "Database Layer";
    conflicts.push({
      topic: `Database Integration (${dbComp})`,
      core_position: `Migrate legacy ORM/JPA mappings to SQLx / async Rust database drivers.`,
      impact_position: `Assess migration risk for schema locks, transaction boundaries, and pool connections (${dbImpacts[0].risk} risk).`,
      resolved: dbImpacts[0].risk !== "high",
    });
  }

  const coreConf = coreAudit?.confidence ?? 0.92;
  const impactConf = impactAudit?.confidence ?? 0.90;
  const unified_confidence = Math.round(((coreConf + impactConf) / 2) * 100) / 100;
  const hasUnresolved = conflicts.some((c) => !c.resolved);

  return {
    iteration: hasUnresolved ? 2 : 1,
    conflicts,
    unified_confidence,
    should_iterate_again: hasUnresolved || unified_confidence < 0.85,
  };
}

export const getConsensusResult = async (projectId: string): Promise<ConsensusResult> => {
  const { isDevMode } = useAuthStore.getState();

  if (!isDevMode) {
    try {
      const data = await fetchApi<ConsensusResult>(`/projects/${projectId}/consensus`);
      return ConsensusResultSchema.parse(data);
    } catch (_err) {
      console.warn(`[MOCK_FALLBACK] Backend /projects/${projectId}/consensus endpoint unavailable; computing dynamic consensus.`);
    }
  }

  if (MOCK_CONSENSUS[projectId] && projectId === "proj-legacy-monolith") {
    return ConsensusResultSchema.parse(MOCK_CONSENSUS[projectId]);
  }

  const srcMap = getProjectSourceCode(projectId);
  const codeFiles = Object.keys(srcMap);
  const primaryFile = codeFiles[0] ? codeFiles[0].split("/").pop() || "App.java" : "Main.java";

  const coreAudit = await getCoreAudit(projectId).catch(() => null);
  const impactAudit = await getImpactAudit(projectId).catch(() => null);

  const dynamicConsensus = calculateDynamicConsensus(coreAudit, impactAudit, primaryFile);
  return ConsensusResultSchema.parse(dynamicConsensus);
};

export const getReadinessScore = async (projectId: string): Promise<ReadinessScore> => {
  const { isDevMode } = useAuthStore.getState();

  if (!isDevMode) {
    try {
      const data = await fetchApi<ReadinessScore>(`/projects/${projectId}/readiness`);
      return ReadinessScoreSchema.parse(data);
    } catch (_err) {
      console.warn(`[MOCK_FALLBACK] Backend /projects/${projectId}/readiness endpoint unavailable; computing dynamic readiness score.`);
    }
  }

  if (MOCK_READINESS_SCORES[projectId] && projectId === "proj-legacy-monolith") {
    return ReadinessScoreSchema.parse(MOCK_READINESS_SCORES[projectId]);
  }

  const coreAudit = await getCoreAudit(projectId).catch(() => null);
  const impactAudit = await getImpactAudit(projectId).catch(() => null);

  const dynamicReadiness = calculateDynamicReadinessScore(coreAudit, impactAudit, null);

  if (localProjectsStore[projectId]) {
    localProjectsStore[projectId].readiness_score = dynamicReadiness.overall;
  }

  return ReadinessScoreSchema.parse(dynamicReadiness);
};
