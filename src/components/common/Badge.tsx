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

  let styles = "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700";

  if (["medium", "deprecated", "pending", "awaiting_approval", "analyzing"].includes(normalized)) {
    styles = "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/80 font-mono";
  } else if (["high", "eol", "rejected", "fail"].includes(normalized)) {
    styles = "bg-zinc-900 text-zinc-100 border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-300 font-mono font-bold";
  } else if (["current", "approved", "pass"].includes(normalized)) {
    styles = "bg-zinc-50 text-zinc-900 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 font-mono";
  } else if (["low", "info"].includes(normalized)) {
    styles = "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800/80 dark:text-zinc-300 dark:border-zinc-700 font-mono";
  }

  const displayText = label || variant;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${styles} ${className}`}
    >
      {displayText.toUpperCase()}
    </span>
  );
};
