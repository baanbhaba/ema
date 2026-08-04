import type { Blueprint, BlueprintStep } from "../types/contracts";
import { BlueprintSchema, BlueprintStepSchema } from "../types/contracts";
import { fetchApi } from "./client";
import { useAuthStore } from "../store/useAuthStore";
import { generateBlueprintWithNvidia } from "./nvidiaEngine";
import { getProjectSourceCode } from "./project";

let localBlueprintsStore: Record<string, Blueprint> = {};

export const getBlueprint = async (projectId: string): Promise<Blueprint> => {
  const { isDevMode } = useAuthStore.getState();

  // If logged in as 'baanbhaba', ALWAYS generate live NVIDIA AI blueprint steps from uploaded code
  if (isDevMode) {
    if (!localBlueprintsStore[projectId] || !localBlueprintsStore[projectId].steps || localBlueprintsStore[projectId].steps[0]?.file_or_module === "pom.xml / build.gradle") {
      const srcMap = getProjectSourceCode(projectId);
      const code = Object.values(srcMap).join("\n") || "public class Main { public static void main(String[] args) {} }";
      const aiBlueprint = await generateBlueprintWithNvidia(projectId, projectId, code);
      if (aiBlueprint && aiBlueprint.steps && aiBlueprint.steps.length > 0) {
        localBlueprintsStore[projectId] = aiBlueprint;
        return BlueprintSchema.parse(aiBlueprint);
      }
    }
  }

  // Return cached blueprint if available
  if (localBlueprintsStore[projectId]) {
    return BlueprintSchema.parse(localBlueprintsStore[projectId]);
  }

  try {
    const data = await fetchApi<Blueprint>(`/projects/${projectId}/blueprint`);
    localBlueprintsStore[projectId] = data;
    return BlueprintSchema.parse(data);
  } catch (_err) {
    console.warn(`[MOCK_FALLBACK] Backend /projects/${projectId}/blueprint endpoint unavailable; initializing blueprint.`);
    const srcMap = getProjectSourceCode(projectId);
    const codeFiles = Object.keys(srcMap);
    const primaryFile = codeFiles[0] || "src/main/java/com/acme/service/MainController.java";

    localBlueprintsStore[projectId] = {
      project_id: projectId,
      steps: [
        {
          id: "step-1",
          file_or_module: primaryFile,
          what_changes: "Migrate REST Controller and javax.* packages to Java 21 / Rust Axum handlers",
          why: "Convert legacy Java OOP controller to high-performance Rust Axum service",
          target_pattern: "// Live NVIDIA AI Rewriting Target",
          risk_level: "high",
          depends_on: [],
          status: "pending",
        },
      ],
    };
    return BlueprintSchema.parse(localBlueprintsStore[projectId]);
  }
};

export const regenerateBlueprintWithNvidiaAI = async (projectId: string): Promise<Blueprint> => {
  const srcMap = getProjectSourceCode(projectId);
  const code = Object.values(srcMap).join("\n") || "public class Main { public static void main(String[] args) {} }";
  const aiBlueprint = await generateBlueprintWithNvidia(projectId, projectId, code);
  if (aiBlueprint && aiBlueprint.steps && aiBlueprint.steps.length > 0) {
    localBlueprintsStore[projectId] = aiBlueprint;
    return BlueprintSchema.parse(aiBlueprint);
  }
  return getBlueprint(projectId);
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
    console.warn(`[MOCK_FALLBACK] Backend step approval endpoint unavailable; updating step ${stepId} in local state.`);
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
    console.warn(`[MOCK_FALLBACK] Backend step rejection endpoint unavailable; rejecting step ${stepId} in local state.`);
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
    console.warn(`[MOCK_FALLBACK] Backend step update endpoint unavailable; updating step ${stepId} in local state.`);
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
    console.warn(`[MOCK_FALLBACK] Backend approve-all endpoint unavailable; approving all steps in local blueprint for ${projectId}.`);
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
