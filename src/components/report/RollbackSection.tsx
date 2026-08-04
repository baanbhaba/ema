import React, { useState } from "react";
import { Card } from "../common/Card";
import { Undo2, Copy, Check } from "lucide-react";

interface RollbackSectionProps {
  rollbackPlan: string;
}

export const RollbackSection: React.FC<RollbackSectionProps> = ({ rollbackPlan }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rollbackPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between w-full font-mono">
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100">
            <Undo2 className="w-4 h-4 text-amber-500" />
            <span>Rollback Protocol & Instructions</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded text-xs border border-zinc-200 dark:border-zinc-700 font-mono"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-amber-500" />
                <span className="text-amber-500 font-bold">Copied Protocol</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Shell Commands</span>
              </>
            )}
          </button>
        </div>
      }
      subtitle="Executable rollback procedure generated automatically by EMA prior to transformation"
    >
      <div className="space-y-2 font-mono">
        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs text-zinc-700 dark:text-zinc-300 font-sans">
          <strong>Rollback Notice:</strong> Execute the shell instructions below to revert repository state if post-deployment checks fail.
        </div>
        <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
          {rollbackPlan}
        </pre>
      </div>
    </Card>
  );
};
