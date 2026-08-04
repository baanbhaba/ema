import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShieldAlert, LogOut } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import { useAuthStore } from "../../store/useAuthStore";

export const Header: React.FC = () => {
  const location = useLocation();
  const { toggleHamburger, isSimulatingApiError, toggleSimulateApiError } = useUiStore();
  const { logout } = useAuthStore();

  const projectMatch = location.pathname.match(/\/projects\/([^/]+)/);
  const currentProjectId = projectMatch ? projectMatch[1] : null;

  return (
    <header className="sticky top-0 z-40 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-b border-zinc-300 dark:border-zinc-800 font-mono transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left Brand & Context */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-7 h-7 bg-amber-500 rounded flex items-center justify-center font-bold text-black text-sm shadow-xs">
              E
            </div>
            <span className="font-bold text-base tracking-wider text-zinc-900 dark:text-white">EMA</span>
          </Link>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-800 hidden sm:block"></div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span>Java → Rust Axum Production Pipeline</span>
            {currentProjectId && (
              <>
                <span className="text-zinc-400 dark:text-zinc-600">/</span>
                <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{currentProjectId}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulateApiError}
            className={`px-2.5 py-1 rounded text-xs border flex items-center space-x-1.5 transition-colors ${
              isSimulatingApiError
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/40"
                : "bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-400 border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
            title="Toggle artificial API errors to test UI fallback components"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">API Simulation: {isSimulatingApiError ? "ERR" : "OK"}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 rounded transition-colors"
            title="Logout Admin Session"
          >
            <LogOut className="w-4 h-4 text-zinc-400" />
          </button>

          {/* Clean Hamburger Menu Button */}
          <button
            onClick={toggleHamburger}
            className="p-2 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-800 rounded transition-colors flex items-center space-x-2"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold hidden sm:inline">MENU</span>
          </button>
        </div>
      </div>
    </header>
  );
};
