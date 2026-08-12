import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, MoveRight, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import { useUiStore } from "../store/useUiStore";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUiStore();

  // Sync dark mode with document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter your username and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        // Mock registration logic
        if (!email.trim() || !fullName.trim()) {
          setErrorMsg("Please fill out all registration fields.");
          setIsSubmitting(false);
          return;
        }
        // Proceed to login directly after successful mock registration
        const success = await login(username, password);
        if (success) navigate("/");
        else setErrorMsg("Registration successful, but auto-login failed.");
      } else {
        const success = await login(username, password);
        if (success) {
          toast.success("Successfully logged in");
          navigate("/");
        } else {
          toast.error("Invalid username or password");
          setErrorMsg("Invalid username or password. Please try again.");
        }
      }
    } catch {
      toast.error("An error occurred during authentication");
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col justify-center items-center p-4 transition-colors">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-amber-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shadow-xs"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-500" />}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <img src="/cpu.png" alt="ALCHEMI" className="w-9 h-9 rounded-lg object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-zinc-900 dark:text-white font-mono">
              ALCHEMI
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Enterprise Migration Platform
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg space-y-5 transition-colors">
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${!isRegistering ? "bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${isRegistering ? "bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
            >
              Sign Up
            </button>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {isRegistering ? "Create your account" : "Sign in to your account"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRegistering ? "Fill out the details to get started." : "Enter your credentials to access the platform."}
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isRegistering && (
              <>
                <div className="space-y-1.5">
                  <label htmlFor="login-fullname" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Full Name
                  </label>
                  <input
                    id="login-fullname"
                    type="text"
                    required={isRegistering}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required={isRegistering}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isRegistering ? "Choose a username" : "Enter your username"}
                className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>{isRegistering ? "Signing up..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? "Sign Up" : "Sign In"}</span>
                  <MoveRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
          ALCHEMI Code Transformation Engine &mdash; Secure Session
        </p>
      </div>
    </div>
  );
};
