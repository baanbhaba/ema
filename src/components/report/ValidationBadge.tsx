import React from "react";
import type { ValidationResult } from "../../types/contracts";
import { TriangleAlert, CircleCheckBig, CircleX } from "lucide-react";

interface ValidationBadgeProps {
  validation: ValidationResult;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ validation }) => {
  const isNoCoverage =
    validation.coverage_note.toLowerCase().includes("no test coverage") ||
    validation.tests_run === 0;

  if (isNoCoverage) {
    return (
      <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded space-y-1 text-xs text-amber-800 dark:text-amber-300 font-mono">
        <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-200">
          <TriangleAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="uppercase tracking-wider">
            UNVERIFIED: No Test Coverage
          </span>
        </div>
        <p className="text-[11px] text-amber-700 dark:text-amber-400 pl-5 font-sans">
          Code compiled successfully, but zero unit tests ran ({validation.coverage_note}). Manual testing recommended.
        </p>
      </div>
    );
  }

  if (validation.build_status === "pass") {
    return (
      <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-0.5 text-xs font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 font-bold text-zinc-900 dark:text-zinc-100">
            <CircleCheckBig className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            <span>Validation Passed ({validation.tests_passed}/{validation.tests_run} tests)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            100% PASS
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 pl-5">{validation.coverage_note}</p>
      </div>
    );
  }

  return (
    <div className="p-2.5 bg-zinc-900 border border-zinc-700 rounded space-y-1 text-xs text-zinc-100 font-mono">
      <div className="flex items-center space-x-1.5 font-bold text-red-400">
        <CircleX className="w-3.5 h-3.5 shrink-0" />
        <span>Build / Test Suite Failed</span>
      </div>
      {validation.lint_issues.map((issue, idx) => (
        <p key={idx} className="text-[11px] text-zinc-400 pl-5">
          • {issue}
        </p>
      ))}
    </div>
  );
};
