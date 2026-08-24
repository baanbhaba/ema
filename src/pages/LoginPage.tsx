import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#fdf8f0] dark:bg-[#181211] text-[#231917] dark:text-[#fdf8f0] font-mono flex flex-col justify-center items-center p-4 transition-colors relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2.5 bg-[#fff8f6] dark:bg-[#231917] border-2 border-[#231917] dark:border-[#f4a300] text-[#231917] dark:text-[#fdf8f0] shadow-[2px_2px_0px_#231917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[#f4a300]" /> : <Moon className="w-4 h-4 text-[#f4a300]" />}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center">
            <motion.div
              className="p-2 bg-[#f4a300] border-2 border-[#231917] shadow-[3px_3px_0px_#231917] -rotate-2"
              initial={{ scale: 0.6, rotate: -12 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={{ type: "spring", stiffness: 360, damping: 22, delay: 0.1 }}
            >
              <img src="/cpu.png" alt="ALCHEMI" className="w-10 h-10 object-cover" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-3xl font-display uppercase tracking-wider text-[#231917] dark:text-[#fdf8f0]">
              ALCHEMI
            </h1>
            <p className="text-xs text-[#5c4a45] dark:text-[#dcc0ba] font-editorial italic text-[14px]">
              "Automated Legacy Code Transformation Engine"
            </p>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-[#fff8f6] dark:bg-[#231917] border-2 border-[#231917] dark:border-[#f4a300] p-6 shadow-[6px_6px_0px_#231917] dark:shadow-[6px_6px_0px_#f4a300] space-y-5 transition-colors"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >

          <div className="flex bg-[#fdf8f0] dark:bg-[#181211] p-1 border-2 border-[#231917] dark:border-[#f4a300] shadow-[2px_2px_0px_#231917]">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-black uppercase transition-all ${!isRegistering ? "bg-[#f4a300] text-[#231917] border border-[#231917] shadow-[1px_1px_0px_#231917]" : "text-[#5c4a45] dark:text-[#dcc0ba] hover:text-[#231917]"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-black uppercase transition-all ${isRegistering ? "bg-[#f4a300] text-[#231917] border border-[#231917] shadow-[1px_1px_0px_#231917]" : "text-[#5c4a45] dark:text-[#dcc0ba] hover:text-[#231917]"}`}
            >
              Sign Up
            </button>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#231917] dark:text-[#fdf8f0]">
              {isRegistering ? "Create Account" : "Access Platform"}
            </h2>
            <p className="text-xs text-[#5c4a45] dark:text-[#dcc0ba] font-sans font-medium">
              {isRegistering ? "Fill out credentials to get started." : "Enter your credentials to enter the workspace."}
            </p>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="p-3 bg-[#a43152] text-[#fdf8f0] border-2 border-[#231917] shadow-[2px_2px_0px_#231917] text-xs font-bold flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isRegistering && (
              <>
                <div className="space-y-1">
                  <label htmlFor="login-fullname" className="block text-xs font-black uppercase text-[#231917] dark:text-[#fdf8f0]">
                    Full Name
                  </label>
                  <input
                    id="login-fullname"
                    type="text"
                    required={isRegistering}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2 bg-[#fdf8f0] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] shadow-[2px_2px_0px_#231917] text-xs text-[#231917] dark:text-[#fdf8f0] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="login-email" className="block text-xs font-black uppercase text-[#231917] dark:text-[#fdf8f0]">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required={isRegistering}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full px-3.5 py-2 bg-[#fdf8f0] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] shadow-[2px_2px_0px_#231917] text-xs text-[#231917] dark:text-[#fdf8f0] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label
                htmlFor="login-username"
                className="block text-xs font-black uppercase text-[#231917] dark:text-[#fdf8f0]"
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
                placeholder={isRegistering ? "Choose username" : "Enter username"}
                className="w-full px-3.5 py-2 bg-[#fdf8f0] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] shadow-[2px_2px_0px_#231917] text-xs text-[#231917] dark:text-[#fdf8f0] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="login-password"
                className="block text-xs font-black uppercase text-[#231917] dark:text-[#fdf8f0]"
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
                  placeholder="Enter password"
                  className="w-full px-3.5 py-2 pr-10 bg-[#fdf8f0] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] shadow-[2px_2px_0px_#231917] text-xs text-[#231917] dark:text-[#fdf8f0] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#231917] dark:text-[#fdf8f0]"
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
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#f4a300] hover:bg-[#d48b00] text-[#231917] font-black text-xs uppercase border-2 border-[#231917] shadow-[3px_3px_0px_#231917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#231917] border-t-transparent animate-spin" />
                  <span>{isRegistering ? "CREATING..." : "SIGNING IN..."}</span>
                </>
              ) : (
                <>
                  <span>{isRegistering ? "CREATE ACCOUNT" : "SIGN IN"}</span>
                  <MoveRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-[10px] font-bold text-[#5c4a45] dark:text-[#dcc0ba]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          ALCHEMI Code Transformation Engine • Secured Session
        </motion.p>
      </div>
    </div>
  );
};
