import type { Blueprint, BlueprintStep } from "../types/contracts";
import { BlueprintSchema, BlueprintStepSchema } from "../types/contracts";
import { fetchApi } from "./client";
import { MOCK_BLUEPRINTS } from "./mockData";

let localBlueprintsStore: Record<string, Blueprint> = JSON.parse(JSON.stringify(MOCK_BLUEPRINTS));

export const getBlueprint = async (projectId: string): Promise<Blueprint> => {
  try {
    const data = await fetchApi<Blueprint>(`/projects/${projectId}/blueprint`);
    return BlueprintSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend /projects/${projectId}/blueprint endpoint unavailable; returning development mock blueprint.`);
    const mock = localBlueprintsStore[projectId] || {
      project_id: projectId,
      steps: [
        {
          id: "step-1",
          file_or_module: "pom.xml",
          what_changes: "Upgrade Java target version to 21",
          why: "Baseline migration step",
          target_pattern: "<java.version>21</java.version>",
          risk_level: "high",
          depends_on: [],
          status: "pending",
        },
      ],
    };
    return BlueprintSchema.parse(mock);
  }
};

export const approveBlueprintStep = async (
  projectId: string,
  stepId: string
): Promise<BlueprintStep> => {
  try {
    const data = await fetchApi<BlueprintStep>(
      `/projects/${projectId}/blueprint/steps/${stepId}/approve`,
      { method: "POST" }
    );
    return BlueprintStepSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend step approval endpoint unavailable; updating step ${stepId} in local mock blueprint.`);
    const blueprint = await getBlueprint(projectId);
    const step = blueprint.steps.find((s) => s.id === stepId);
    if (!step) throw new Error(`Step '${stepId}' not found`);
    step.status = "approved";
    step.rejection_reason = undefined;
    if (localBlueprintsStore[projectId]) {
      const idx = localBlueprintsStore[projectId].steps.findIndex((s) => s.id === stepId);
      if (idx !== -1) localBlueprintsStore[projectId].steps[idx] = step;
    }
    return BlueprintStepSchema.parse(step);
  }
};

export const rejectBlueprintStep = async (
  projectId: string,
  stepId: string,
  reason: string
): Promise<BlueprintStep> => {
  if (!reason || reason.trim().length === 0) {
    throw new Error("Rejection reason is required when rejecting a blueprint step.");
  }
  try {
    const data = await fetchApi<BlueprintStep>(
      `/projects/${projectId}/blueprint/steps/${stepId}/reject`,
      {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() }),
      }
    );
    return BlueprintStepSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend step rejection endpoint unavailable; rejecting step ${stepId} in local mock blueprint.`);
    const blueprint = await getBlueprint(projectId);
    const step = blueprint.steps.find((s) => s.id === stepId);
    if (!step) throw new Error(`Step '${stepId}' not found`);
    step.status = "rejected";
    step.rejection_reason = reason.trim();
    if (localBlueprintsStore[projectId]) {
      const idx = localBlueprintsStore[projectId].steps.findIndex((s) => s.id === stepId);
      if (idx !== -1) localBlueprintsStore[projectId].steps[idx] = step;
    }
    return BlueprintStepSchema.parse(step);
  }
};

export const updateBlueprintStep = async (
  projectId: string,
  stepId: string,
  patch: Partial<BlueprintStep>
): Promise<BlueprintStep> => {
  try {
    const data = await fetchApi<BlueprintStep>(
      `/projects/${projectId}/blueprint/steps/${stepId}`,
      {
        method: "PATCH",
        body: JSON.stringify(patch),
      }
    );
    return BlueprintStepSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend step update endpoint unavailable; updating step ${stepId} in local mock blueprint.`);
    const blueprint = await getBlueprint(projectId);
    const stepIndex = blueprint.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) throw new Error(`Step '${stepId}' not found`);
    blueprint.steps[stepIndex] = { ...blueprint.steps[stepIndex], ...patch };
    if (localBlueprintsStore[projectId]) {
      localBlueprintsStore[projectId].steps[stepIndex] = blueprint.steps[stepIndex];
    }
    return BlueprintStepSchema.parse(blueprint.steps[stepIndex]);
  }
};

export const approveAllBlueprintSteps = async (projectId: string): Promise<Blueprint> => {
  try {
    const data = await fetchApi<Blueprint>(`/projects/${projectId}/blueprint/approve-all`, {
      method: "POST",
    });
    return BlueprintSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend approve-all endpoint unavailable; approving all steps in local mock blueprint for ${projectId}.`);
    const blueprint = await getBlueprint(projectId);
    blueprint.steps = blueprint.steps.map((s) => ({
      ...s,
      status: "approved",
      rejection_reason: undefined,
    }));
    localBlueprintsStore[projectId] = blueprint;
    return BlueprintSchema.parse(blueprint);
  }
};
