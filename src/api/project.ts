import type {
  ProjectSummary,
  CoreAudit,
  ImpactAudit,
  ConsensusResult,
  ReadinessScore,
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

let localProjectsStore: Record<string, ProjectSummary> = {};
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
  try {
    const res = await fetchApi<ProjectSummary>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return ProjectSummarySchema.parse(res);
  } catch (_err) {
    console.warn("[MOCK_FALLBACK] Backend /projects POST endpoint unavailable; creating project in local state.");
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
    return ProjectSummarySchema.parse(newSummary);
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    await fetchApi<{ success: boolean }>(`/projects/${projectId}`, {
      method: "DELETE",
    });
    delete localProjectsStore[projectId];
    delete sourceCodeStore[projectId];
    delete liveCoreAudits[projectId];
    delete liveImpactAudits[projectId];
    return true;
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend DELETE /projects/${projectId} endpoint unavailable; removing from local state.`);
    if (localProjectsStore[projectId]) {
      delete localProjectsStore[projectId];
      delete sourceCodeStore[projectId];
      delete liveCoreAudits[projectId];
      delete liveImpactAudits[projectId];
      return true;
    }
    return false;
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

export const getConsensusResult = async (projectId: string): Promise<ConsensusResult> => {
  try {
    const data = await fetchApi<ConsensusResult>(`/projects/${projectId}/consensus`);
    return ConsensusResultSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend consensus endpoint unavailable for project ${projectId}; returning consensus.`);
    const mock = MOCK_CONSENSUS[projectId] || {
      iteration: 1,
      conflicts: [],
      unified_confidence: 0.92,
      should_iterate_again: false,
    };
    return ConsensusResultSchema.parse(mock);
  }
};

export const getReadinessScore = async (projectId: string): Promise<ReadinessScore> => {
  try {
    const data = await fetchApi<ReadinessScore>(`/projects/${projectId}/readiness`);
    return ReadinessScoreSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend readiness endpoint unavailable for project ${projectId}; returning score.`);
    const mock = MOCK_READINESS_SCORES[projectId] || {
      overall: 85,
      breakdown: {
        architecture_understanding: 90,
        dependency_resolution: 85,
        api_compatibility: 80,
        configuration_completeness: 80,
        migration_feasibility: 90,
        breaking_change_risk: 80,
        rollback_availability: 95,
      },
    };
    return ReadinessScoreSchema.parse(mock);
  }
};
