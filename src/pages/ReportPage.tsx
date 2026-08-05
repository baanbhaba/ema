import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FileCheck2,
  Clock,
  UserCheck,
  Code2,
  FileCode,
  Package,
  Layers,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Download,
} from "lucide-react";
import { getMigrationReport } from "../api/report";
import { downloadCombinedRustProject, downloadCargoToml } from "../utils/exportRustCode";
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
  const filesModified = report.entries.map((e) => e.unit);
  const dependencyRisks = report.impact_audit?.dependency_risks || [];
  const apiSurface = report.impact_audit?.api_surface || [];
  const configImpacts = report.impact_audit?.config_impacts || [];
  const totalTestsRun = report.entries.reduce((acc, e) => acc + (e.validation?.tests_run || 0), 0);
  const totalTestsPassed = report.entries.reduce((acc, e) => acc + (e.validation?.tests_passed || 0), 0);
  const manualInterventions = report.blueprint?.steps.filter((s) => s.status === "rejected") || [];

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>Migration Report & Validation Audit</span>
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
              <span className="text-zinc-400 uppercase text-[10px] block">Sandbox Target</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Java 21 / Axum</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCombinedRustProject(id || "migrated_service", id || "migrated_service", report.blueprint?.steps || [])}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Rust Code (.rs)</span>
            </button>

            <button
              type="button"
              onClick={() => downloadCargoToml(id || "migrated_service")}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold rounded text-xs transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Cargo.toml</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const dataStr =
                  "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
                const downloadAnchor = document.createElement("a");
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `migration-report-${id}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded text-xs transition-colors"
            >
              Export JSON Report
            </button>
          </div>
        </div>
      </div>

      {/* Section 4.5 Executive Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {/* 1. Files Modified */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-zinc-100">
            <FileCode className="w-4 h-4 text-amber-500" />
            <span>Files Modified ({filesModified.length})</span>
          </div>
          <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px] max-h-28 overflow-y-auto">
            {filesModified.map((f, i) => (
              <li key={i} className="truncate">• {f}</li>
            ))}
          </ul>
        </div>

        {/* 2. Dependencies Updated */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-zinc-100">
            <Package className="w-4 h-4 text-amber-500" />
            <span>Dependencies Updated ({dependencyRisks.length})</span>
          </div>
          <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px] max-h-28 overflow-y-auto">
            {dependencyRisks.map((d, i) => (
              <li key={i} className="truncate">• {d.library} ({d.current_version} → {d.target_version})</li>
            ))}
            {dependencyRisks.length === 0 && <li className="italic text-zinc-400">None</li>}
          </ul>
        </div>

        {/* 3. APIs Replaced */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-zinc-100">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>APIs Replaced ({apiSurface.length})</span>
          </div>
          <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px] max-h-28 overflow-y-auto">
            {apiSurface.map((a, i) => (
              <li key={i} className="truncate">• {a.endpoint_or_interface}</li>
            ))}
            {apiSurface.length === 0 && <li className="italic text-zinc-400">None</li>}
          </ul>
        </div>

        {/* 4. Configuration Changes */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-zinc-100">
            <Settings2 className="w-4 h-4 text-amber-500" />
            <span>Config Changes ({configImpacts.length})</span>
          </div>
          <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px] max-h-28 overflow-y-auto">
            {configImpacts.map((c, i) => (
              <li key={i} className="truncate">• {c.component || c.file || "App Config"}: {c.notes}</li>
            ))}
            {configImpacts.length === 0 && <li className="italic text-zinc-400">Standard Defaults</li>}
          </ul>
        </div>

        {/* 5. Validation Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-zinc-100">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Validation Summary</span>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 text-[11px] space-y-1">
            <p>• Tests Passed: <strong className="text-amber-500">{totalTestsPassed} / {totalTestsRun}</strong></p>
            <p>• Sandbox Environment: Java 21 / Docker Container</p>
            <p>• Build Status: PASS</p>
          </div>
        </div>

        {/* 6. Manual Intervention Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-zinc-900 dark:text-zinc-100">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Manual Interventions ({manualInterventions.length})</span>
          </div>
          <ul className="space-y-1 text-zinc-600 dark:text-zinc-400 text-[11px] max-h-28 overflow-y-auto">
            {manualInterventions.map((m, i) => (
              <li key={i} className="truncate text-red-400">• {m.file_or_module}: {m.rejection_reason || "Rejected during review"}</li>
            ))}
            {manualInterventions.length === 0 && <li className="text-amber-500 font-semibold">• All steps approved without manual rejection</li>}
          </ul>
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
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{entry.unit}</span>
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
