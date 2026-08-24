import React, { useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { HamburgerDrawer } from "./HamburgerDrawer";
import { useUiStore } from "../../store/useUiStore";
import { AlertCircle, CircleCheckBig, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-[#f8f6f0] dark:bg-[#0d1117] text-[#181c24] dark:text-[#f0f6fc] flex flex-col font-sans transition-colors relative">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:font-black focus:border-2 focus:border-[#181c24] focus:shadow-[2px_2px_0px_#181c24] focus:text-sm focus:outline-none"
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
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full text-xs pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
        role="status"
      >
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`pointer-events-auto p-3.5 border-2 border-[#181c24] dark:border-[#30363d] shadow-[3px_3px_0px_#181c24] dark:shadow-[3px_3px_0px_#010409] flex items-start justify-between space-x-3 transition-colors ${
                n.type === "success"
                  ? "bg-white dark:bg-[#161b22] text-[#181c24] dark:text-[#f0f6fc] border-l-6 border-l-emerald-500"
                  : n.type === "info"
                  ? "bg-white dark:bg-[#161b22] text-[#181c24] dark:text-[#f0f6fc] border-l-6 border-l-blue-500"
                  : "bg-white dark:bg-[#161b22] text-[#181c24] dark:text-[#f0f6fc] border-l-6 border-l-amber-500"
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {n.type === "warning" ? (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CircleCheckBig className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <span className="font-semibold leading-relaxed">{n.message}</span>
              </div>

              <button
                onClick={() => removeNotification(n.id)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white p-0.5 shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
