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
  MOCK_PROJECTS,
  MOCK_CORE_AUDITS,
  MOCK_IMPACT_AUDITS,
  MOCK_CONSENSUS,
  MOCK_READINESS_SCORES,
} from "./mockData";

let localProjectsStore: Record<string, ProjectSummary> = {};
MOCK_PROJECTS.forEach((p) => {
  localProjectsStore[p.id] = p;
});

export const getProjects = async (): Promise<ProjectSummary[]> => {
  try {
    const data = await fetchApi<ProjectSummary[]>("/projects");
    return data.map((item) => ProjectSummarySchema.parse(item));
  } catch (_err) {
    console.warn("[MOCK_FALLBACK] Backend /projects endpoint unavailable; returning development mock projects list.");
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
    console.warn("[MOCK_FALLBACK] Backend /projects POST endpoint unavailable; creating project in local mock state.");
    const id = `proj-${Date.now().toString(36)}`;
    const newSummary: ProjectSummary = {
      id,
      name: data.name,
      repo_url: data.repo_url || "N/A",
      stage: "ingesting",
      readiness_score: 0,
      last_updated: new Date().toISOString(),
      java_from: "Java 8",
      java_to: "Java 21",
    };
    localProjectsStore[id] = newSummary;
    return ProjectSummarySchema.parse(newSummary);
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    await fetchApi<{ success: boolean }>(`/projects/${projectId}`, {
      method: "DELETE",
    });
    delete localProjectsStore[projectId];
    return true;
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend DELETE /projects/${projectId} endpoint unavailable; removing from local mock state.`);
    if (localProjectsStore[projectId]) {
      delete localProjectsStore[projectId];
      return true;
    }
    return false;
  }
};

export const getProjectSourceCode = (_projectId: string): Record<string, string> => {
  return {};
};

export const getCoreAudit = async (projectId: string): Promise<CoreAudit> => {
  try {
    const data = await fetchApi<CoreAudit>("/analyze/core", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
    return CoreAuditSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend /analyze/core endpoint unavailable for project ${projectId}; returning local mock audit.`);
    const mock = MOCK_CORE_AUDITS[projectId] || MOCK_CORE_AUDITS["proj-payment-gateway"];
    return CoreAuditSchema.parse(mock);
  }
};

export const getImpactAudit = async (projectId: string): Promise<ImpactAudit> => {
  try {
    const data = await fetchApi<ImpactAudit>("/analyze/impact", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
    return ImpactAuditSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend /analyze/impact endpoint unavailable for project ${projectId}; returning local mock audit.`);
    const mock = MOCK_IMPACT_AUDITS[projectId] || MOCK_IMPACT_AUDITS["proj-payment-gateway"];
    return ImpactAuditSchema.parse(mock);
  }
};

export const getConsensusResult = async (projectId: string): Promise<ConsensusResult> => {
  try {
    const data = await fetchApi<ConsensusResult>(`/projects/${projectId}/consensus`);
    return ConsensusResultSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend consensus endpoint unavailable for project ${projectId}; returning local mock consensus.`);
    const mock = MOCK_CONSENSUS[projectId] || MOCK_CONSENSUS["proj-payment-gateway"];
    return ConsensusResultSchema.parse(mock);
  }
};

export const getReadinessScore = async (projectId: string): Promise<ReadinessScore> => {
  try {
    const data = await fetchApi<ReadinessScore>(`/projects/${projectId}/readiness`);
    return ReadinessScoreSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend readiness endpoint unavailable for project ${projectId}; returning local mock score.`);
    const mock = MOCK_READINESS_SCORES[projectId] || MOCK_READINESS_SCORES["proj-payment-gateway"];
    return ReadinessScoreSchema.parse(mock);
  }
};
