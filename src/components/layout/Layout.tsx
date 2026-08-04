import React, { useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { HamburgerDrawer } from "./HamburgerDrawer";
import { useUiStore } from "../../store/useUiStore";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

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
      <Header />
      <HamburgerDrawer />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Toast / Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-md w-full font-mono text-xs pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="pointer-events-auto p-3.5 bg-zinc-900 dark:bg-zinc-900 text-amber-400 border border-amber-500/50 shadow-2xl rounded-lg flex items-start justify-between space-x-3 transition-all transform animate-in slide-in-from-bottom-2"
          >
            <div className="flex items-start space-x-2.5">
              {n.type === "warning" ? (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block text-zinc-100">{n.message}</span>
                <span className="text-[10px] text-zinc-400 font-sans mt-0.5 block">
                  Backend Rust service connection required to perform live execution.
                </span>
              </div>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-zinc-500 hover:text-zinc-200 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
