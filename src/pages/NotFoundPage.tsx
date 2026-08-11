import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Terminal, Undo2, LayoutDashboard, AlertTriangle } from "lucide-react";

const GLITCH_FRAMES = ["404", "4Ø4", "404", "4▓4", "404", "▓▓▓", "404"];

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [glitch, setGlitch] = useState("404");
  const [frame, setFrame] = useState(0);
  const [typed, setTyped] = useState("");
  const fullText = `> ERROR: Route '${location.pathname}' does not exist in this execution context.`;

  // Glitch animation on the 404
  useEffect(() => {
    let count = 0;
    const iv = setInterval(() => {
      setGlitch(GLITCH_FRAMES[count % GLITCH_FRAMES.length]);
      setFrame((f) => f + 1);
      count++;
      if (count >= GLITCH_FRAMES.length * 3) clearInterval(iv);
    }, 80);
    return () => clearInterval(iv);
  }, []);

  // Typewriter for the error line
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(iv);
      }
    }, 22);
    return () => clearInterval(iv);
  }, [fullText]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col items-center justify-center p-6 select-none">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
        }}
      />

      <div className="relative z-10 max-w-xl w-full space-y-8 text-center">
        {/* Big glitch number */}
        <div className="relative">
          <span
            className="text-[120px] md:text-[180px] font-extrabold leading-none tracking-tighter"
            style={{
              color: frame % 6 < 1 ? "#f59e0b" : "#18181b",
              textShadow:
                frame % 7 < 2
                  ? "3px 0 #f59e0b, -3px 0 #ef4444"
                  : "2px 0 #f59e0b, -2px 0 #71717a",
              transition: "text-shadow 0.05s, color 0.05s",
            }}
          >
            {glitch}
          </span>
          {/* Amber underline pulse */}
          <div className="h-1 bg-amber-500 rounded-full mt-2 mx-auto w-24 animate-pulse" />
        </div>

        {/* System error block */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-left space-y-3">
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              ALCHEMI — Kernel Panic
            </span>
          </div>

          {/* Typewriter error line */}
          <div className="text-xs text-red-400 min-h-[1.5rem] break-all">
            {typed}
            <span className="animate-pulse">█</span>
          </div>

          <div className="space-y-1 text-[11px] text-zinc-500">
            <div>
              <span className="text-zinc-400">stack:</span> NavigationError at Router.resolve()
            </div>
            <div>
              <span className="text-zinc-400">code:</span> ROUTE_NOT_FOUND (0x404)
            </div>
            <div>
              <span className="text-zinc-400">hint:</span> The requested pipeline view or resource
              was not registered in this deployment.
            </div>
          </div>
        </div>

        {/* Terminal-style trace */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-left text-[11px] text-zinc-500 space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-bold">alchemi-engine — shell</span>
          </div>
          <div>
            <span className="text-green-500">alchemi@prod</span>:<span className="text-blue-400">~</span>$ resolve{" "}
            <span className="text-amber-400">{location.pathname}</span>
          </div>
          <div className="text-red-500">bash: {location.pathname}: No such route</div>
          <div>
            <span className="text-green-500">alchemi@prod</span>:<span className="text-blue-400">~</span>$ _
            <span className="animate-pulse">▌</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="notfound-go-back"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-200 text-xs rounded-lg transition-all duration-150 cursor-pointer group"
          >
            <Undo2 className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Go Back</span>
          </button>
          <button
            id="notfound-go-dashboard"
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer group"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>

        <p className="text-[10px] text-zinc-700">
          ALCHEMI Code Transformation Engine • Build {import.meta.env?.VITE_BUILD_ID || "dev"}
        </p>
      </div>
    </div>
  );
};
