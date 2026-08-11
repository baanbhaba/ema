import React from "react";
import { CircuitBoard, BadgeCheck, UsersRound, Activity, FolderGit, ShieldCheck, Cpu } from "lucide-react";
import { Card } from "../components/common/Card";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/client";

export const AccountPage: React.FC = () => {
  const { username, isDevMode } = useAuthStore();

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projectCount = projects?.length ?? 0;
  const activeProjects = projects?.filter((p) => p.stage !== "complete") ?? [];

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Account & Profile
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            Manage your account, review usage, and configure approval permissions.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs">
          <BadgeCheck className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-bold text-amber-700 dark:text-amber-400">
            {isDevMode ? "Developer" : "Administrator"}
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <CircuitBoard className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Profile</span>
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-600 dark:text-amber-400 text-xl"
              aria-label={`Avatar for ${username}`}
            >
              {username ? username.substring(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{username || "admin"}</h2>
              <p className="text-xs text-zinc-500">
                {isDevMode ? "dev@alchemi.ai" : "admin@organization.internal"}
              </p>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700">
                  {isDevMode ? "Developer Account" : "Senior Migration Admin"}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Blueprint Approval: Granted</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2"
          role="region"
          aria-label="Project statistics"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Projects</span>
            <FolderGit className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 block">{projectCount}</span>
          <p className="text-[11px] text-zinc-500 font-sans">Java→Rust migration projects</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Active Pipelines</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 block">
            {activeProjects.length}
          </span>
          <p className="text-[11px] text-zinc-500 font-sans">In-progress migrations</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>LLM Token Usage</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 block">Active</span>
          <p className="text-[11px] text-zinc-500 font-sans">Tracked via AI Proxy Audit</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Approval Access</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 block">Full</span>
          <p className="text-[11px] text-zinc-500 font-sans">Blueprint approval rights</p>
        </div>
      </div>

      {/* Team Governance */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <UsersRound className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Team & Approval Governance</span>
          </div>
        }
        subtitle="Team members with blueprint approval and transformation execution permissions"
      >
        <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-2">
          <UsersRound className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Single-user workspace</p>
          <p className="text-xs text-zinc-500 font-sans max-w-xs mx-auto">
            You are the sole administrator. Team collaboration features allow you to invite members with
            role-based approval access for blueprint reviews.
          </p>
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            onClick={() => {
              // Team invite feature placeholder
            }}
          >
            <UsersRound className="w-3.5 h-3.5" />
            <span>Invite Team Members</span>
          </button>
        </div>
      </Card>
    </div>
  );
};
