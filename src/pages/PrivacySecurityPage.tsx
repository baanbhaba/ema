import React from "react";
import { Shield, Lock, Server, FileCheck2, HardDrive } from "lucide-react";

export const PrivacySecurityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Privacy & Security
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Governance, encryption, and zero-retention policies for ALCHEMI transformations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Zero Retention Policy</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Source code uploaded for analysis is held strictly in memory during processing. We do not persist raw proprietary source code in our AI models or use it for training.
          </p>
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Encrypted Infrastructure</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            All data in transit is protected via TLS 1.3. Persistent metadata and user sessions are stored using robust AES-256 encryption at rest in our secured Neon PostgreSQL clusters.
          </p>
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Role-Based Access Control</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Multi-tenant workspaces are strictly isolated. Role-Based Access Control (RBAC) ensures developers, reviewers, and admins have precise, least-privilege permissions.
          </p>
        </div>

        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">SOC2 & ISO 27001 Prepared</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            ALCHEMI is architected with enterprise compliance in mind, providing comprehensive audit trails and deterministic code tracking for automated SOC2 reporting.
          </p>
        </div>
      </div>
      
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 flex items-start space-x-3">
        <FileCheck2 className="w-5 h-5 text-zinc-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Audit Logs</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            System operations are logged using structured tracing, ensuring verifiable event history. Contact your Administrator to access telemetry and compliance logs.
          </p>
        </div>
      </div>
    </div>
  );
};
