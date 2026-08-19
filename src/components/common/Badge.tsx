import React from "react";

export type BadgeVariant =
  | "low"
  | "medium"
  | "high"
  | "current"
  | "deprecated"
  | "eol"
  | "approved"
  | "pending"
  | "rejected"
  | "pass"
  | "fail"
  | "info";

interface BadgeProps {
  variant: BadgeVariant | string;
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, label, className = "" }) => {
  const normalized = (variant || "").toLowerCase();

  let styles = "bg-zinc-100 text-zinc-800 border-2 border-[#181c24] dark:bg-zinc-800 dark:text-zinc-200 dark:border-[#30363d]";

  if (["medium", "deprecated", "pending", "awaiting_approval", "analyzing"].includes(normalized)) {
    styles = "bg-amber-100 text-amber-900 border-2 border-[#181c24] dark:bg-amber-500/20 dark:text-amber-300 dark:border-[#30363d] font-bold";
  } else if (["high", "eol", "rejected", "fail"].includes(normalized)) {
    styles = "bg-rose-100 text-rose-900 border-2 border-[#181c24] dark:bg-rose-500/20 dark:text-rose-300 dark:border-[#30363d] font-bold";
  } else if (["current", "approved", "pass"].includes(normalized)) {
    styles = "bg-emerald-100 text-emerald-900 border-2 border-[#181c24] dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-[#30363d] font-bold";
  } else if (["low", "info"].includes(normalized)) {
    styles = "bg-blue-100 text-blue-900 border-2 border-[#181c24] dark:bg-blue-500/20 dark:text-blue-300 dark:border-[#30363d] font-semibold";
  } else if (["ready", "active"].includes(normalized)) {
    styles = "bg-amber-500 text-black border-2 border-[#181c24] dark:border-[#30363d] font-bold";
  }

  const displayText = label || variant;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] uppercase tracking-wide font-mono rounded-xs shadow-[1px_1px_0px_#181c24] dark:shadow-[1px_1px_0px_#010409] ${styles} ${className}`}
    >
      {displayText.toUpperCase()}
    </span>
  );
};
