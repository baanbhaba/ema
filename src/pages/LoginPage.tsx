import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, AlertCircle, User, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUiStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const success = login(username, password);
    if (success) {
      navigate("/");
    } else {
      setErrorMsg("Invalid credentials. Alpha Access: Username 'admin' / Password 'admin'");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono flex flex-col justify-center items-center p-4 transition-colors">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-amber-500 transition-colors flex items-center space-x-2 text-xs"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-500" />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Brand Header */}
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center font-bold text-black text-xl shadow-lg">
            E
          </div>
          <span className="font-bold text-2xl tracking-wider text-zinc-900 dark:text-white">EMA</span>
        </div>

        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
            Engineering Migration Assistant
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans">
            Production Legacy Code Migration Engine (Java 8 → Rust Axum)
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-left space-y-5 shadow-2xl transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="font-bold text-zinc-800 dark:text-zinc-300 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>ALPHA ACCESS PORTAL</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
              v1.0.0 PROD
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-sans text-[11px]">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Username</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Authenticate & Enter Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Alpha Credentials Note */}
          <div className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 font-sans">
            <div className="flex items-center space-x-1.5 font-bold font-mono text-zinc-800 dark:text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Alpha Credentials:</span>
            </div>
            <p>Username: <code className="text-amber-600 dark:text-amber-400 font-mono">admin</code></p>
            <p>Password: <code className="text-amber-600 dark:text-amber-400 font-mono">admin</code></p>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
          EMA Enterprise Migration Platform • Rust Tokio Axum Engine
        </p>
      </div>
    </div>
  );
};
