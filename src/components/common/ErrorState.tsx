import React from "react";
import { TriangleAlert, IterationCw } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message = "An error occurred while fetching data from the migration engine API.",
  onRetry,
}) => {
  const { isSimulatingApiError, toggleSimulateApiError } = useUiStore();

  return (
    <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg space-y-3 text-red-800 dark:text-red-200">
      <div className="flex items-start space-x-3">
        <TriangleAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-red-200 dark:border-red-900/50 text-xs">
        <span className="text-red-600 dark:text-red-400">
          API Failure Mode: <strong>{isSimulatingApiError ? "ENABLED" : "DISABLED"}</strong>
        </span>

        <div className="flex items-center space-x-2">
          {isSimulatingApiError && (
            <button
              onClick={() => toggleSimulateApiError()}
              className="px-2.5 py-1 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 rounded font-semibold text-[11px] border border-red-300 dark:border-red-700"
            >
              Turn off simulated error
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded font-medium hover:bg-red-700"
            >
              <IterationCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
