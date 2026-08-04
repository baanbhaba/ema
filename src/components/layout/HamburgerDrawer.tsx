import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Layers,
  Zap,
  BarChart3,
  GitPullRequest,
  FileCheck2,
  Sun,
  Moon,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import { useAuthStore } from "../../store/useAuthStore";

export const HamburgerDrawer: React.FC = () => {
  const location = useLocation();
  const { isHamburgerOpen, setHamburgerOpen, isDarkMode, toggleDarkMode } = useUiStore();
  const { logout, username } = useAuthStore();

  if (!isHamburgerOpen) return null;

  const match = location.pathname.match(/\/projects\/([^/]+)/);
  const projectId = match ? match[1] : null;

  const primaryNavItems = [
    { label: "Projects Dashboard", path: "/", icon: LayoutDashboard },
  ];

  const projectNavItems = projectId
    ? [
        { label: "Core Audit", path: `/projects/${projectId}/core-audit`, icon: Layers },
        { label: "Impact & Blast Radius", path: `/projects/${projectId}/impact-audit`, icon: Zap },
        { label: "Readiness & Consensus", path: `/projects/${projectId}/readiness`, icon: BarChart3 },
        { label: "Blueprint Review", path: `/projects/${projectId}/blueprint`, icon: GitPullRequest },
        { label: "Migration Report", path: `/projects/${projectId}/report`, icon: FileCheck2 },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-mono">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setHamburgerOpen(false)}
      ></div>

      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-l border-zinc-300 dark:border-zinc-800 h-full flex flex-col justify-between z-10 shadow-2xl p-5 overflow-y-auto transition-colors">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center font-bold text-black text-xs">
                E
              </div>
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-wider">
                EMA CONTROL PANEL
              </span>
            </div>

            <button
              onClick={() => setHamburgerOpen(false)}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">
                Theme Mode
              </span>
              <span className="text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                {isDarkMode ? "DARK MONOCHROME" : "LIGHT MONOCHROME"}
              </span>
            </div>

            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-zinc-700 transition-colors text-xs text-zinc-800 dark:text-zinc-200"
            >
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-amber-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                TOGGLE
              </span>
            </button>
          </div>

          {/* Global Enterprise Nav */}
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block px-2 mb-1">
              Enterprise Navigation
            </span>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setHamburgerOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded text-xs transition-colors ${
                    isActive
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Active Project Pipeline Controls */}
          {projectId && (
            <div className="space-y-1 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block px-2 mb-1">
                Active Project ({projectId})
              </span>
              {projectNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setHamburgerOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded text-xs transition-colors ${
                      isActive
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-zinc-500" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 p-2.5 rounded border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-amber-500 text-xs">
                {username ? username.substring(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block truncate">
                  {username || "admin"}
                </span>
                <div className="flex items-center space-x-1 text-[10px] text-zinc-500">
                  <ShieldCheck className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Alpha Admin Session</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setHamburgerOpen(false);
              }}
              className="p-1.5 rounded bg-zinc-200 dark:bg-zinc-800 text-red-500 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-600 text-center font-sans">
            EMA Pipeline v1.0.0 PROD • Barebones Java → Rust Engine
          </p>
        </div>
      </div>
    </div>
  );
};
