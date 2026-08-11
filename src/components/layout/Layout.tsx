import React, { useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { HamburgerDrawer } from "./HamburgerDrawer";
import { useUiStore } from "../../store/useUiStore";
import { AlertCircle, CircleCheckBig, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode, notifications, removeNotification } = useUiStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors relative">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:font-bold focus:rounded-lg focus:text-sm focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <HamburgerDrawer />
      <div className="flex flex-1">
        <Sidebar />
        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full overflow-x-hidden"
          role="main"
        >
          {children}
        </main>
      </div>

      {/* Global Toast / Notification Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full font-mono text-xs pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
        role="status"
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-3.5 border shadow-2xl rounded-lg flex items-start justify-between space-x-3 transition-all ${
              n.type === "success"
                ? "bg-zinc-900 text-green-400 border-green-500/40"
                : n.type === "info"
                ? "bg-zinc-900 text-blue-300 border-blue-500/40"
                : "bg-zinc-900 text-amber-400 border-amber-500/40"
            }`}
          >
            <div className="flex items-start space-x-2.5">
              {n.type === "warning" ? (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <CircleCheckBig className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              )}
              <span className="font-semibold text-zinc-100 leading-relaxed">{n.message}</span>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
