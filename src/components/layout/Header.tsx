import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, LogOut } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import { useAuthStore } from "../../store/useAuthStore";

export const Header: React.FC = () => {
  const location = useLocation();
  const { toggleHamburger } = useUiStore();
  const { logout, isDevMode } = useAuthStore();

  const projectMatch = location.pathname.match(/\/projects\/([^/]+)/);
  const currentProjectId = projectMatch ? projectMatch[1] : null;

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
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 font-mono transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand & Breadcrumb */}
        <div className="flex items-center space-x-3 min-w-0">
          <Link to="/" className="flex items-center space-x-2.5 shrink-0" aria-label="ALCHEMI Home">
            <img src="/cpu.png" alt="ALCHEMI Logo" className="w-7 h-7 rounded object-cover" />
            <span className="font-bold text-sm tracking-wider text-zinc-900 dark:text-white">ALCHEMI</span>
          </Link>

          {/* Breadcrumb */}
          {(currentProjectId || routeLabel) && (
            <>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />
              <div className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 min-w-0">
                {currentProjectId && (
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[120px]">
                    {currentProjectId.replace("proj-", "").replace(/-/g, " ")}
                  </span>
                )}
                {routeLabel && currentProjectId && (
                  <span className="text-zinc-300 dark:text-zinc-600">/</span>
                )}
                {routeLabel && (
                  <span className="text-zinc-500 dark:text-zinc-400 truncate">{routeLabel}</span>
                )}
              </div>
            </>
          )}

          {/* Dev mode badge */}
          {isDevMode && (
            <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold uppercase tracking-wider shrink-0">
              Dev
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
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
