import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bolt, Database, Sliders, TriangleAlert, ChevronDown, ChevronRight, Layers, ScanText } from "lucide-react";
import { getImpactAudit } from "../api/client";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";

export const ImpactAuditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedDependency, setExpandedDependency] = useState<string | null>(null);
  const [expandedBlastIndex, setExpandedBlastIndex] = useState<number | null>(null);

  const {
    data: impact,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["impact-audit", id],
    queryFn: () => getImpactAudit(id || ""),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (isError) {
    return (
      <ErrorState
        title="Failed to load Impact Audit"
        message={error instanceof Error ? error.message : "Error fetching impact audit"}
        onRetry={refetch}
      />
    );
  }
  if (!impact) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2 font-mono">
            <span>Impact & Blast Radius Audit</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Evaluates breaking change exposure across public API interfaces, database schema dialects, configurations, and third-party libraries.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-4 py-2.5 flex items-center space-x-3 shrink-0 font-mono">
          <div className="text-right">
            <span className="text-[10px] uppercase text-zinc-400 block">
              Impact Confidence
            </span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {Math.round(impact.confidence * 100)}%
            </span>
          </div>
          <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center font-bold">
            <Bolt className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 1. API Surface Table */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Public API Surface Risk</span>
          </div>
        }
        subtitle="Downstream clients and breaking change risk levels"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 py-2">Endpoint / Interface</th>
                <th className="px-3 py-2">Consumers</th>
                <th className="px-3 py-2 text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {impact.api_surface.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.endpoint_or_interface}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {item.consumers.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-[10px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Badge variant={item.breaking_change_risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 2. Database & Config Impacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title={
            <div className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Database Schema & Driver Impacts</span>
            </div>
          }
        >
          <div className="space-y-2">
            {impact.database_impacts.length > 0 ? (
              impact.database_impacts.map((db, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {db.component || db.file || "Database Layer"}
                    </span>
                    <Badge variant={db.risk} />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">{db.notes}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">No database impacts detected.</p>
            )}
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center space-x-2">
              <Sliders className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Configuration Impacts</span>
            </div>
          }
        >
          <div className="space-y-2">
            {impact.config_impacts.length > 0 ? (
              impact.config_impacts.map((cfg, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {cfg.component || cfg.file || "Config Layer"}
                    </span>
                    <Badge variant={cfg.risk} />
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">{cfg.notes}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">No config impacts detected.</p>
            )}
          </div>
        </Card>
      </div>

      {/* 3. Dependency Risks Table */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Dependency Upgrade Risks</span>
          </div>
        }
        subtitle="Version jumps and known breaking changes"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 py-2">Library</th>
                <th className="px-3 py-2">Current</th>
                <th className="px-3 py-2">Target</th>
                <th className="px-3 py-2 text-right">Breaking Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {impact.dependency_risks.map((dep, idx) => {
                const isExpanded = expandedDependency === dep.library;
                return (
                  <React.Fragment key={idx}>
                    <tr
                      onClick={() =>
                        setExpandedDependency(isExpanded ? null : dep.library)
                      }
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer"
                    >
                      <td className="px-3 py-2 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center space-x-1.5">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        )}
                        <span>{dep.library}</span>
                      </td>
                      <td className="px-3 py-2 text-zinc-500">{dep.current_version}</td>
                      <td className="px-3 py-2 text-amber-500 font-semibold">{dep.target_version}</td>
                      <td className="px-3 py-2 text-right font-bold text-zinc-900 dark:text-zinc-100">
                        {dep.known_breaking_changes.length} changes
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-zinc-50 dark:bg-zinc-950">
                        <td colSpan={4} className="px-5 py-3">
                          <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded space-y-1">
                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                              Known Breaking Changes ({dep.current_version} → {dep.target_version}):
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                              {dep.known_breaking_changes.map((bc, bIdx) => (
                                <li key={bIdx}>{bc}</li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Blast Radius Section */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <Bolt className="w-3.5 h-3.5 text-amber-500" />
            <span>Blast Radius Summary</span>
          </div>
        }
        subtitle="Expand flagged architectural changes to view affected source files"
      >
        <div className="space-y-2 font-mono">
          {impact.blast_radius.map((blast, idx) => {
            const isExpanded = expandedBlastIndex === idx;
            return (
              <div
                key={idx}
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3"
              >
                <div
                  onClick={() => setExpandedBlastIndex(isExpanded ? null : idx)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <Badge variant={blast.severity} />
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{blast.change}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-zinc-500 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                      {blast.affected_files.length} files
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                      Affected Manifest:
                    </span>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-2 text-xs space-y-0.5 max-h-40 overflow-y-auto">
                      {blast.affected_files.map((file, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-1.5 text-zinc-700 dark:text-zinc-300">
                          <ScanText className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
