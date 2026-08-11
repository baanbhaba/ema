import React, { useState } from "react";
import { ShieldCheck, UserCheck, CheckCircle2, Lock, Award, ShieldAlert, Cpu } from "lucide-react";
import { Card } from "../common/Card";

interface ApprovalWorkflowCardProps {
  projectName: string;
  totalSteps: number;
  approvedSteps: number;
  onApproveAll?: () => void;
}

export const ApprovalWorkflowCard: React.FC<ApprovalWorkflowCardProps> = ({
  projectName,
  totalSteps,
  approvedSteps,
  onApproveAll,
}) => {
  const [role, setRole] = useState<"Lead Architect" | "Security Auditor" | "DevOps Engineer">("Lead Architect");
  const [signedBy, setSignedBy] = useState<string>("Lead Architect (Active Session)");

  const isFullyApproved = totalSteps > 0 && approvedSteps === totalSteps;

  return (
    <Card className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Role-Based Governance & Compliance Sign-Off
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
              Human-in-the-loop validation policies required before promoting modules to target Rust architecture.
            </p>
          </div>
        </div>

        {/* Active Role Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-400">Reviewer Role:</span>
          <select
            value={role}
            onChange={(e) => {
              const r = e.target.value as any;
              setRole(r);
              setSignedBy(`${r} (Active Session)`);
            }}
            className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded px-2.5 py-1 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="Lead Architect">Lead Architect</option>
            <option value="Security Auditor">Security Auditor</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>
      </div>

      {/* Role Sign-off & Policy Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded flex items-center space-x-3">
          <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 block uppercase">Reviewer Signature</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block">{signedBy}</span>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded flex items-center space-x-3">
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 block uppercase">Policy Requirement</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate block">
              {role === "Lead Architect" ? "High Risk Sign-off Required" : "Standard Compliance Audit"}
            </span>
          </div>
        </div>

        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded flex items-center space-x-3">
          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isFullyApproved ? "text-emerald-500" : "text-amber-500"}`} />
          <div className="min-w-0">
            <span className="text-[10px] text-zinc-400 block uppercase">Step Approval Progress</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {approvedSteps} / {totalSteps} Modules Approved
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded flex items-center space-x-1 font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>RAII Ownership Guarantee</span>
        </span>
        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded flex items-center space-x-1 font-bold">
          <Cpu className="w-3 h-3" />
          <span>Send + Sync Thread Safety</span>
        </span>
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded flex items-center space-x-1 font-bold">
          <Award className="w-3 h-3" />
          <span>SOC2 Type II Compatible Audit Log</span>
        </span>
      </div>
    </Card>
  );
};
