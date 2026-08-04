import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GitPullRequest,
  CheckCircle2,
  Expand,
  Shrink,
  AlertCircle,
  ArrowRight,
  Eye,
  Info,
} from "lucide-react";
import {
  getBlueprint,
  approveBlueprintStep,
  rejectBlueprintStep,
  updateBlueprintStep,
  approveAllBlueprintSteps,
} from "../api/client";
import type { BlueprintStep } from "../types/contracts";
import { Card } from "../components/common/Card";
import { StepCard } from "../components/blueprint/StepCard";
import { StepRejectModal } from "../components/blueprint/StepRejectModal";
import { StepEditModal } from "../components/blueprint/StepEditModal";
import { ConfirmBulkApproveModal } from "../components/blueprint/ConfirmBulkApproveModal";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import { useUiStore } from "../store/useUiStore";

export const BlueprintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    viewedSteps,
    expandedSteps,
    toggleStepExpanded,
    expandAllSteps,
    collapseAllSteps,
    markAllStepsViewed,
  } = useUiStore();

  const [rejectModalStepId, setRejectModalStepId] = useState<string | null>(null);
  const [rejectModalFile, setRejectModalFile] = useState<string>("");
  const [editingStep, setEditingStep] = useState<BlueprintStep | null>(null);
  const [isConfirmBulkOpen, setIsConfirmBulkOpen] = useState(false);

  const {
    data: blueprint,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["blueprint", id],
    queryFn: () => getBlueprint(id || ""),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: (stepId: string) => approveBlueprintStep(id || "", stepId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blueprint", id] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ stepId, reason }: { stepId: string; reason: string }) =>
      rejectBlueprintStep(id || "", stepId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blueprint", id] });
      setRejectModalStepId(null);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      stepId,
      patch,
    }: {
      stepId: string;
      patch: { what_changes: string; target_pattern: string };
    }) => updateBlueprintStep(id || "", stepId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blueprint", id] });
      setEditingStep(null);
    },
  });

  const bulkApproveMutation = useMutation({
    mutationFn: () => approveAllBlueprintSteps(id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blueprint", id] });
      setIsConfirmBulkOpen(false);
      navigate(`/projects/${id}/report`);
    },
  });

  const sortedSteps = useMemo(() => {
    if (!blueprint?.steps) return [];
    const steps = [...blueprint.steps];
    return steps.sort((a, b) => {
      if (a.depends_on.includes(b.id)) return 1;
      if (b.depends_on.includes(a.id)) return -1;
      return a.depends_on.length - b.depends_on.length;
    });
  }, [blueprint]);

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError) {
    return (
      <ErrorState
        title="Failed to load Blueprint"
        message={error instanceof Error ? error.message : "Error fetching blueprint steps"}
        onRetry={refetch}
      />
    );
  }
  if (!blueprint) return null;

  const projectViewedSteps = viewedSteps[id || ""] || [];
  const allViewed = sortedSteps.every((s) => projectViewedSteps.includes(s.id));
  const unviewedCount = sortedSteps.filter((s) => !projectViewedSteps.includes(s.id)).length;

  const approvedCount = sortedSteps.filter((s) => s.status === "approved").length;
  const rejectedCount = sortedSteps.filter((s) => s.status === "rejected").length;
  const pendingCount = sortedSteps.filter((s) => s.status === "pending").length;

  const uniqueFilesCount = new Set(sortedSteps.map((s) => s.file_or_module)).size;

  const handleApproveAllClick = () => {
    if (allViewed) {
      setIsConfirmBulkOpen(true);
    }
  };

  const handleMarkAllAsViewed = () => {
    markAllStepsViewed(
      id || "",
      sortedSteps.map((s) => s.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2 font-mono">
            <span>Blueprint Human Review</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            Review and approve individual transformation steps ordered by dependency prerequisites.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          {!allViewed && (
            <button
              onClick={handleMarkAllAsViewed}
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs rounded border border-zinc-300 dark:border-zinc-700 flex items-center space-x-1.5"
              title="Mark all steps as viewed to enable bulk approval"
              data-testid="mark-all-viewed-btn"
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Mark All Reviewed</span>
            </button>
          )}

          <button
            onClick={handleApproveAllClick}
            disabled={!allViewed || sortedSteps.length === 0}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded text-xs font-bold transition-all ${
              allViewed && sortedSteps.length > 0
                ? "bg-amber-500 hover:bg-amber-600 text-black shadow-2xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
            }`}
            data-testid="approve-all-btn"
          >
            <span>Approve All & Execute</span>
          </button>
        </div>
      </div>

      {!allViewed && (
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded flex items-center space-x-2 text-zinc-700 dark:text-zinc-300 text-xs font-mono">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Review Required: You have <strong>{unviewedCount} unreviewed step(s)</strong>. Inspect each step to enable bulk approval.
          </span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Total Steps</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{sortedSteps.length}</span>
          </div>
          <GitPullRequest className="w-5 h-5 text-zinc-400" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Approved</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{approvedCount}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-zinc-400" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Rejected</span>
            <span className="text-lg font-bold text-amber-500">{rejectedCount}</span>
          </div>
          <AlertCircle className="w-5 h-5 text-amber-500" />
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">Pending</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{pendingCount}</span>
          </div>
          <div className="text-xs font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            {Math.round((approvedCount / (sortedSteps.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Blueprint Steps */}
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <GitPullRequest className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Transformation Steps</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <button
                onClick={() => expandAllSteps(sortedSteps.map((s) => s.id))}
                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 flex items-center space-x-1"
              >
                <Expand className="w-3 h-3" />
                <span>Expand All</span>
              </button>
              <button
                onClick={collapseAllSteps}
                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 flex items-center space-x-1"
              >
                <Shrink className="w-3 h-3" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>
        }
        subtitle="Ordered topographically: prerequisite dependencies are listed before downstream modules"
      >
        <div className="space-y-3">
          {sortedSteps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              projectId={id || ""}
              isExpanded={expandedSteps.includes(step.id)}
              onToggleExpand={() => toggleStepExpanded(step.id)}
              onApprove={(stepId) => approveMutation.mutate(stepId)}
              onOpenRejectModal={(stepId, file) => {
                setRejectModalStepId(stepId);
                setRejectModalFile(file);
              }}
              onOpenEditModal={(st) => setEditingStep(st)}
              allSteps={sortedSteps}
            />
          ))}
        </div>
      </Card>

      {approvedCount > 0 && (
        <div className="pt-2 flex justify-end font-mono">
          <button
            onClick={() => navigate(`/projects/${id}/report`)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <span>View Generated Migration Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <StepRejectModal
        isOpen={!!rejectModalStepId}
        stepId={rejectModalStepId}
        stepFile={rejectModalFile}
        onClose={() => setRejectModalStepId(null)}
        onConfirmReject={(stepId, reason) => rejectMutation.mutate({ stepId, reason })}
        isSubmitting={rejectMutation.isPending}
      />

      <StepEditModal
        isOpen={!!editingStep}
        step={editingStep}
        onClose={() => setEditingStep(null)}
        onSaveEdit={(stepId, patch) => editMutation.mutate({ stepId, patch })}
        isSubmitting={editMutation.isPending}
      />

      <ConfirmBulkApproveModal
        isOpen={isConfirmBulkOpen}
        stepCount={sortedSteps.length}
        fileCount={uniqueFilesCount}
        onClose={() => setIsConfirmBulkOpen(false)}
        onConfirm={() => bulkApproveMutation.mutate()}
        isSubmitting={bulkApproveMutation.isPending}
      />
    </div>
  );
};
