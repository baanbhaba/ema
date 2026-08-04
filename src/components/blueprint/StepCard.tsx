import React, { useEffect, useState } from "react";
import type { BlueprintStep } from "../../types/contracts";
import { Badge } from "../common/Badge";
import {
  Check,
  X,
  Edit2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import { useAuthStore } from "../../store/useAuthStore";
import { triggerTransformation } from "../../api/transform";
import { getProjectSourceCode } from "../../api/project";

interface StepCardProps {
  step: BlueprintStep;
  projectId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApprove: (stepId: string) => void;
  onOpenRejectModal: (stepId: string, file: string) => void;
  onOpenEditModal: (step: BlueprintStep) => void;
  allSteps: BlueprintStep[];
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  projectId,
  isExpanded,
  onToggleExpand,
  onApprove,
  onOpenRejectModal,
  onOpenEditModal,
  allSteps,
}) => {
  const { viewedSteps, markStepViewed, notifyBackendRequired } = useUiStore();
  const { isDevMode } = useAuthStore();
  const isViewed = (viewedSteps[projectId] || []).includes(step.id);

  const [transformedRustCode, setTransformedRustCode] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);

  const sourceCodeMap = getProjectSourceCode(projectId);
  const rawJavaCode =
    sourceCodeMap[step.file_or_module] ||
    `// Legacy Source: ${step.file_or_module}\n// Target Java 21 / Rust Axum Migration`;

  useEffect(() => {
    if (isExpanded && !isViewed) {
      markStepViewed(projectId, step.id);
    }
    if (isExpanded && isDevMode && !transformedRustCode && !isTransforming) {
      handleRunTransformation();
    }
  }, [isExpanded, isViewed, markStepViewed, projectId, step.id, isDevMode, transformedRustCode, isTransforming]);

  const handleCardClick = () => {
    if (!isViewed) {
      markStepViewed(projectId, step.id);
    }
    onToggleExpand();
  };

  const handleRunTransformation = async () => {
    setIsTransforming(true);
    setTransformError(null);
    if (!isDevMode) {
      notifyBackendRequired("Live Code Transformation Engine");
    }
    try {
      const res = await triggerTransformation(projectId, step.id);
      setTransformedRustCode(res.transformed_code);
      step.target_pattern = res.transformed_code;
    } catch (err) {
      setTransformError(err instanceof Error ? err.message : "Transformation failed");
    } finally {
      setIsTransforming(false);
    }
  };

  const prereqSteps = step.depends_on.map((depId) => {
    const found = allSteps.find((s) => s.id === depId);
    return {
      id: depId,
      file: found?.file_or_module || depId,
      status: found?.status || "pending",
    };
  });

  return (
    <div
      data-testid={`step-card-${step.id}`}
      className={`rounded-lg border transition-all overflow-hidden font-mono ${
        step.status === "approved"
          ? "bg-zinc-50 dark:bg-zinc-900/60 border-amber-500/50"
          : step.status === "rejected"
          ? "bg-red-50/30 dark:bg-red-950/20 border-red-300 dark:border-red-800"
          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
      }`}
    >
      {/* Header Bar */}
      <div
        onClick={handleCardClick}
        className="p-4 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <button
            type="button"
            className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Toggle step details"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-amber-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold shrink-0">
            {step.id}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {step.file_or_module}
              </span>
              <Badge variant={step.risk_level} />
              {isViewed ? (
                <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-200 dark:border-zinc-700 shrink-0">
                  REVIEWED
                </span>
              ) : (
                <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                  NEW
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5 font-sans">{step.what_changes}</p>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="flex items-center space-x-3 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Badge variant={step.status} />

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => onOpenEditModal(step)}
              className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
              title="Edit step"
              data-testid={`edit-btn-${step.id}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onOpenRejectModal(step.id, step.file_or_module)}
              disabled={step.status === "rejected"}
              className={`p-1.5 rounded border ${
                step.status === "rejected"
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-red-500/10 text-red-600 dark:text-red-400 border-zinc-200 dark:border-zinc-700"
              }`}
              title="Reject step"
              data-testid={`reject-btn-${step.id}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onApprove(step.id)}
              disabled={step.status === "approved"}
              className={`px-2.5 py-1 rounded text-xs font-bold flex items-center space-x-1 border transition-colors ${
                step.status === "approved"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/40 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 text-black border-amber-500"
              }`}
              data-testid={`approve-btn-${step.id}`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{step.status === "approved" ? "Approved" : "Approve"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Prerequisites:</span>
              {prereqSteps.length > 0 ? (
                prereqSteps.map((prereq) => (
                  <span
                    key={prereq.id}
                    className="px-2 py-0.5 rounded border text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  >
                    requires: {prereq.id} ({prereq.file})
                  </span>
                ))
              ) : (
                <span className="italic text-zinc-400">None (Baseline Step)</span>
              )}
            </div>

            <button
              onClick={handleRunTransformation}
              disabled={isTransforming}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded text-xs font-bold transition-colors disabled:opacity-50 shadow-md"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>
                {isTransforming
                  ? "NVIDIA Llama 3.1 70B Rewriting..."
                  : isDevMode
                  ? "Transform Step with Live NVIDIA AI"
                  : "Transform Step"}
              </span>
            </button>
          </div>

          {/* Java Source vs Target Code Diff */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Before: Legacy Source ({step.file_or_module})
              </span>
              <pre className="p-3 bg-zinc-900 text-zinc-200 rounded text-[11px] font-mono overflow-x-auto whitespace-pre border border-zinc-800 max-h-60">
                {rawJavaCode}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  After: Migration Target Code
                </span>
                {isDevMode && transformedRustCode && (
                  <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-bold">
                    LIVE NVIDIA 70B AI OUTPUT
                  </span>
                )}
              </div>
              <pre className="p-3 bg-zinc-900 text-amber-400 rounded text-[11px] font-mono overflow-x-auto whitespace-pre border border-amber-500/30 max-h-60">
                {transformedRustCode || (transformError ? `[Error]: ${transformError}` : (step.target_pattern && !step.target_pattern.includes("ModuleHandler") ? step.target_pattern : "// Click 'Transform Step with Live NVIDIA AI' above to execute live AI rewrite"))}
              </pre>
            </div>
          </div>

          {transformError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 font-mono">
              <span className="font-bold block mb-1">Transformation Error Details:</span>
              <span>{transformError}</span>
            </div>
          )}

          {step.status === "rejected" && step.rejection_reason && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>Rejection Reason:</span>
              </div>
              <p className="font-mono mt-1 text-[11px]">{step.rejection_reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
