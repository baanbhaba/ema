import React from "react";
import { CircuitBoard, BadgeCheck, UsersRound, Waves, Database } from "lucide-react";
import { Card } from "../components/common/Card";
import { useAuthStore } from "../store/useAuthStore";

export const AccountPage: React.FC = () => {
  const { username } = useAuthStore();

  const teamMembers: { name: string; email: string; role: string; canApprove: boolean; canExecute: boolean }[] = [];

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>Account & Organization Profile</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            Manage user roles, blueprint approval governance permissions, and pipeline quotas.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-xs">
          <BadgeCheck className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Alpha Administrator</span>
        </div>
      </div>

      {/* User Profile Card */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <CircuitBoard className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Active Administrator</span>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500 text-lg">
              {username ? username.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{username || "admin"}</h3>
              <p className="text-xs text-zinc-500">admin@organization.internal</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                  Senior Migration Admin
                </span>
                <span className="text-[10px] text-amber-500 font-bold">Blueprint Approval: Granted</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Team Approval Governance Table */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <UsersRound className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Team Approval Roles & Governance</span>
          </div>
        }
        subtitle="Only authorized Senior Architects can approve blueprints before code transformation runs"
      >
        {teamMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-zinc-400 uppercase bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-3 py-2">Team Member</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2 text-center">Blueprint Approval</th>
                  <th className="px-3 py-2 text-right">Execute Transformation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {teamMembers.map((m, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{m.name}</span>
                      <span className="text-[11px] text-zinc-500">{m.email}</span>
                    </td>
                    <td className="px-3 py-2 text-zinc-400">{m.role}</td>
                    <td className="px-3 py-2 text-center font-bold">
                      {m.canApprove ? <span className="text-amber-500">ALLOWED</span> : <span className="text-zinc-500">READ ONLY</span>}
                    </td>
                    <td className="px-3 py-2 text-right font-bold">
                      {m.canExecute ? <span className="text-zinc-200">AUTHORIZED</span> : <span className="text-zinc-500">RESTRICTED</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-zinc-400 font-sans border border-dashed border-zinc-300 dark:border-zinc-800 rounded">
            N/A - 0 Additional Team Members Configured. Active User ({username || "admin"}) holds sole approval rights.
          </div>
        )}
      </Card>

      {/* Quotas & Usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>LLM Token Usage</span>
            <Waves className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 block">0 / 20M</span>
          <p className="text-[10px] text-zinc-500 font-sans">Monthly enterprise allocation</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Pipelines</span>
            <Database className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 block">0 Active</span>
          <p className="text-[10px] text-zinc-500 font-sans">Java → Rust Migrations</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Sandbox Executions</span>
            <BadgeCheck className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 block">0 Passes</span>
          <p className="text-[10px] text-zinc-500 font-sans">Docker JDK runs</p>
        </div>
      </div>
    </div>
  );
};
