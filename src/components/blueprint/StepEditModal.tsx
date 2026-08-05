import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import type { BlueprintStep } from "../../types/contracts";

interface StepEditModalProps {
  isOpen: boolean;
  step: BlueprintStep | null;
  onClose: () => void;
  onSaveEdit: (stepId: string, patch: { what_changes: string; target_pattern: string }) => void;
  isSubmitting?: boolean;
}

export const StepEditModal: React.FC<StepEditModalProps> = ({
  isOpen,
  step,
  onClose,
  onSaveEdit,
  isSubmitting = false,
}) => {
  const [whatChanges, setWhatChanges] = useState("");
  const [targetPattern, setTargetPattern] = useState("");

  useEffect(() => {
    if (step) {
      setWhatChanges(step.what_changes);
      setTargetPattern(step.target_pattern);
    }
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step) {
      onSaveEdit(step.id, {
        what_changes: whatChanges,
        target_pattern: targetPattern,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Blueprint Step: ${step?.id}`}
      maxWidth="xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-step-form"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Step Changes"}
          </button>
        </>
      }
    >
      <form id="edit-step-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
            Target Module / File
          </label>
          <input
            type="text"
            disabled
            value={step?.file_or_module || ""}
            className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-300 mb-1">Proposed Transformation</label>
          <textarea
            rows={2}
            value={whatChanges}
            onChange={(e) => setWhatChanges(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-300 mb-1">Target Pattern / Code Template</label>
          <textarea
            rows={6}
            value={targetPattern}
            onChange={(e) => setTargetPattern(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-blue-500 font-mono whitespace-pre"
          />
        </div>
      </form>
    </Modal>
  );
};
