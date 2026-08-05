import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { AlertCircle } from "lucide-react";

interface StepRejectModalProps {
  isOpen: boolean;
  stepId: string | null;
  stepFile?: string;
  onClose: () => void;
  onConfirmReject: (stepId: string, reason: string) => void;
  isSubmitting?: boolean;
}

export const StepRejectModal: React.FC<StepRejectModalProps> = ({
  isOpen,
  stepId,
  stepFile,
  onClose,
  onConfirmReject,
  isSubmitting = false,
}) => {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("A rejection reason is required so the re-analysis agent can recalculate the blueprint.");
      return;
    }
    setErrorMsg("");
    if (stepId) {
      onConfirmReject(stepId, reason.trim());
      setReason("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reject Blueprint Step: ${stepId}`}
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
            form="reject-step-form"
            disabled={isSubmitting || !reason.trim()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Confirm Rejection"}
          </button>
        </>
      }
    >
      <form id="reject-step-form" onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-zinc-700 dark:text-zinc-300">
          Target module: <strong className="font-mono text-blue-600 dark:text-blue-400">{stepFile}</strong>
        </p>

        <div>
          <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-300 mb-1">
            Rejection Reason * <span className="text-zinc-500 font-normal">(Required for agent feedback loop)</span>
          </label>
          <textarea
            required
            rows={4}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setErrorMsg("");
            }}
            placeholder="Explain why this transformation is rejected (e.g. breaking custom interceptor logic, security policy constraint)..."
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500 font-mono"
          />
          {errorMsg && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};
