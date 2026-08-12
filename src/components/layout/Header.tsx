import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, LogOut, ChevronRight, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUiStore } from "../../store/useUiStore";
import { useAuthStore } from "../../store/useAuthStore";
import { usePermissions } from "../../lib/usePermissions";
import { FeedbackWidget } from "../common/FeedbackWidget";
import { getProjects } from "../../api/client";

export const Header: React.FC = () => {
  const location = useLocation();
  const { toggleHamburger } = useUiStore();
  const { logout, username } = useAuthStore();
  const { role } = usePermissions();

  const projectMatch = location.pathname.match(/\/projects\/([^/]+)/);
  const currentProjectId = projectMatch ? projectMatch[1] : null;

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const activeProject = projects?.find((p) => p.id === currentProjectId);
  const displayProjectName = activeProject
    ? activeProject.name
    : currentProjectId
    ? currentProjectId.replace(/^proj-/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  // Route display name mapping for breadcrumb
  const routeLabel = (() => {
    if (location.pathname.includes("/core-audit")) return "Core Audit";
    if (location.pathname.includes("/impact-audit")) return "Impact Audit";
    if (location.pathname.includes("/blueprint")) return "Blueprint Review";
    if (location.pathname.includes("/readiness")) return "Readiness";
    if (location.pathname.includes("/report")) return "Migration Report";
    if (location.pathname === "/settings") return "Settings";
    if (location.pathname === "/account") return "Account";
    if (location.pathname === "/integrations") return "Integrations";
    return null;
  })();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 font-mono transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand & Breadcrumb */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link to="/" className="flex items-center space-x-2.5 shrink-0" aria-label="ALCHEMI Home">
            <img src="/cpu.png" alt="ALCHEMI Logo" className="w-7 h-7 rounded object-cover" />
            <span className="font-bold text-sm tracking-wider text-zinc-900 dark:text-white">ALCHEMI</span>
          </Link>

          {/* Breadcrumb */}
          {(displayProjectName || routeLabel) && (
            <>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />
              <div className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 min-w-0">
                {displayProjectName && (
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[180px]">
                    {displayProjectName}
                  </span>
                )}
                {routeLabel && displayProjectName && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                )}
                {routeLabel && (
                  <span className="text-zinc-500 dark:text-zinc-400 truncate">{routeLabel}</span>
                )}
              </div>
            </>
          )}

          {/* Role badge */}
          {role && (
            <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold uppercase tracking-wider shrink-0">
              {role.replace('_', ' ')}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Feedback Widget */}
          <FeedbackWidget />

          {/* User Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
              <User className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs font-semibold pr-1 truncate max-w-[100px]">{username || "Guest"}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="group relative p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white text-zinc-600 dark:text-zinc-400 hover:border-red-500 border border-zinc-200 dark:border-zinc-800 rounded transition-all duration-200"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="absolute -bottom-8 right-0 w-max px-2 py-1 bg-zinc-800 dark:bg-zinc-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Sign Out
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleHamburger}
            className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded transition-colors flex items-center space-x-1.5"
            aria-label="Open navigation menu"
          >
            <LayoutGrid className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold hidden sm:inline">MENU</span>
          </button>
        </div>
      </div>
    </header>
  );
};
