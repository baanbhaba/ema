import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, AlertCircle, CircuitBoard, MoveRight, Sun, Moon, ShieldEllipsis } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";
import { Button } from "../components/common/Button";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUiStore();

  // Force light mode on login screen start
  useEffect(() => {
    if (isDarkMode) {
      toggleDarkMode();
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      } else {
        setErrorMsg("Authentication failed. Invalid username or password.");
      }
    } catch (_err) {
      setErrorMsg("Authentication error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono flex flex-col justify-center items-center p-4 transition-colors">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-amber-500 transition-colors flex items-center space-x-2 text-xs shadow-2xs cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-500" />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Brand Header */}
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex items-center justify-center space-x-3">
          <img src="/cpu.png" alt="ALCHEMI Logo" className="w-12 h-12 rounded-lg object-cover shadow-md" />
          <span className="font-bold text-2xl tracking-wider text-zinc-900 dark:text-white">ALCHEMI</span>
        </div>

        <div>
          <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
            Legacy Code Transformation Platform
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans">
            AI Code Modernization Engine (Java 8 → Rust Axum / Java 21)
          </p>
        </div>

        {/* Clean Login Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-left space-y-5 shadow-xl transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center space-x-2">
              <ScanLine className="w-4 h-4 text-amber-500" />
              <span>SECURE ACCESS</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold flex items-center space-x-1">
              <ShieldEllipsis className="w-3 h-3 text-amber-500" />
              <span>Enterprise</span>
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-sans text-[11px]">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
              <div className="relative">
                <CircuitBoard className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <ScanLine className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isSubmitting}
              icon={MoveRight}
              iconPosition="right"
            >
              Authenticate & Enter Engine
            </Button>
          </form>
        </div>

        {/* Credential hint */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg px-4 py-3 text-left text-[10px] font-mono space-y-1.5">
          <div className="text-zinc-500 uppercase tracking-widest mb-2 text-[9px]">Authorized Accounts</div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-amber-500 font-bold">admin</span>
            <span className="text-zinc-600 mx-2">───</span>
            <span>Consumer · Standard Access</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-green-400 font-bold">baanbhaba</span>
            <span className="text-zinc-600 mx-2">───</span>
            <span>Dev Mode · Full AI Engine</span>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-sans">
          ALCHEMI Code Transformation Engine • Secure Session
        </p>
      </div>
    </div>
  );
};
