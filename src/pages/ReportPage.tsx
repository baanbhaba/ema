import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileCheck2,
  Clock,
  UserCheck,
  Code2,
} from "lucide-react";
import { getMigrationReport } from "../api/client";
import { Card } from "../components/common/Card";
import { DiffViewer } from "../components/report/DiffViewer";
import { ValidationBadge } from "../components/report/ValidationBadge";
import { RollbackSection } from "../components/report/RollbackSection";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: report,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["migration-report", id],
    queryFn: () => getMigrationReport(id || ""),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (isError) {
    return (
      <ErrorState
        title="Failed to load Migration Report"
        message={error instanceof Error ? error.message : "Error fetching report"}
        onRetry={refetch}
      />
    );
  }
  if (!report) return null;

  const totalUnits = report.entries.length;

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>Migration Report & Docker Validation Audit</span>
            <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              (built in backend)
            </span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            Complete audit trail of code diffs, automated build/test validations, human approvals, and rollback plans.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 flex items-center space-x-4 text-xs">
            <div>
              <span className="text-zinc-400 uppercase text-[10px] block">Units Migrated</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">{totalUnits}</span>
            </div>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>

            <div>
              <span className="text-zinc-400 uppercase text-[10px] block">Docker Sandbox</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">JDK 8 vs 21</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `migration-report-${id}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded text-xs transition-colors"
          >
            Export JSON Report
          </button>
        </div>
      </div>

      {/* Code Units */}
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Code2 className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Transformed Source Code Units ({totalUnits})</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              (built in backend)
            </span>
          </div>
        }
        subtitle="Unified diffs and build verification status per modified module"
      >
        <div className="space-y-4">
          {report.entries.map((entry, idx) => (
            <div
              key={idx}
              className="bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800 text-xs">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {entry.unit}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-zinc-500 text-[11px]">
                  <div className="flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-zinc-400" />
                    <span>Approved: {entry.approved_by}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(entry.approved_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <ValidationBadge validation={entry.validation} />

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  Unified Code Diff:
                </span>
                <DiffViewer diff={entry.diff} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <RollbackSection rollbackPlan={report.rollback_plan} />
    </div>
  );
};
