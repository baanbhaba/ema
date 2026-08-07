import React from "react";
import { Modal } from "../common/Modal";
import { TriangleAlert } from "lucide-react";

interface ConfirmBulkApproveModalProps {
  isOpen: boolean;
  stepCount: number;
  fileCount: number;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export const ConfirmBulkApproveModal: React.FC<ConfirmBulkApproveModalProps> = ({
  isOpen,
  stepCount,
  fileCount,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Final Transformation Plan Submission"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-mono"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded font-mono transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting Plan..." : "Execute Transformation"}
          </button>
        </>
      }
    >
      <div className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded flex items-start space-x-2 text-amber-800 dark:text-amber-300">
          <TriangleAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 font-mono">Point of No Return</h4>
            <p className="leading-relaxed font-sans">
              You are approving <strong>{stepCount} step(s)</strong> that will modify{" "}
              <strong>{fileCount} file(s)</strong>. Once submitted, the EMA Transformation Agent will execute code rewriting.
            </p>
          </div>
        </div>

        <p className="text-zinc-500 dark:text-zinc-400 font-sans">
          All blueprint prerequisites have been reviewed. Are you ready to dispatch the Transformation Agent?
        </p>
      </div>
    </Modal>
  );
};
