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
    <>
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-600 via-rose-600 to-amber-500" />
      <header className="sticky top-0 z-40 bg-[#ffffff] dark:bg-[#161b22] text-[#181c24] dark:text-[#f0f6fc] border-b-2 border-[#181c24] dark:border-[#30363d] transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center space-x-3 min-w-0">
            <Link to="/" className="flex items-center space-x-2.5 shrink-0 group" aria-label="ALCHEMI Home">
              <div className="p-1.5 bg-amber-500 text-black border-2 border-[#181c24] dark:border-[#30363d] shadow-[2px_2px_0px_#181c24] dark:shadow-[2px_2px_0px_#010409]">
                <img src="/cpu.png" alt="ALCHEMI Logo" className="w-5 h-5 object-cover" />
              </div>
              <span className="font-brand text-2xl tracking-wider text-[#181c24] dark:text-[#f0f6fc]">ALCHEMI</span>
            </Link>

            {/* Breadcrumb */}
            {(displayProjectName || routeLabel) && (
              <>
                <div className="h-5 w-[2px] bg-zinc-300 dark:bg-zinc-700 hidden sm:block shrink-0" />
                <div className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-600 dark:text-zinc-400 min-w-0">
                  {displayProjectName && (
                    <span className="font-bold text-[#181c24] dark:text-[#f0f6fc] truncate max-w-[180px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 rounded-sm">
                      {displayProjectName}
                    </span>
                  )}
                  {routeLabel && displayProjectName && (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  )}
                  {routeLabel && (
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{routeLabel}</span>
                  )}
                </div>
              </>
            )}

            {/* Role badge */}
            {role && (
              <span className="hidden sm:inline text-[11px] px-2 py-0.5 bg-amber-500 text-black font-bold uppercase tracking-wide border-2 border-[#181c24] dark:border-[#30363d] shadow-[2px_2px_0px_#181c24] dark:shadow-[2px_2px_0px_#010409] rounded-xs">
                {role.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2.5">
            {/* Feedback Widget */}
            <FeedbackWidget />

            {/* User Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-[#181c24] dark:border-[#30363d] shadow-[2px_2px_0px_#181c24] dark:shadow-[2px_2px_0px_#010409]">
              <div className="w-4 h-4 bg-zinc-800 dark:bg-zinc-700 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                <User className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-[#181c24] dark:text-[#f0f6fc] truncate max-w-[100px]">{username || "Guest"}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white text-zinc-700 dark:text-zinc-300 border-2 border-[#181c24] dark:border-[#30363d] shadow-[2px_2px_0px_#181c24] dark:shadow-[2px_2px_0px_#010409] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              aria-label="Sign out"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleHamburger}
              className="p-2 bg-amber-500 hover:bg-amber-400 text-black border-2 border-[#181c24] dark:border-[#30363d] shadow-[2px_2px_0px_#181c24] dark:shadow-[2px_2px_0px_#010409] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center space-x-1.5 font-bold cursor-pointer"
              aria-label="Open navigation menu"
            >
              <LayoutGrid className="w-4 h-4 text-black" />
              <span className="text-xs font-bold hidden sm:inline">MENU</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
