import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, MonitorPlay, Layers, Bolt, BarChart3, GitPullRequest, FileCheck2, SlidersHorizontal, CircuitBoard, Cable, Sun, Moon, BadgeCheck, LogOut, ChevronDown, FolderGit, CloudDownload, FileTerminal, RefreshCcw, Sparkles, Lock } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";
import { useAuthStore } from "../../store/useAuthStore";
import { getProjects, getBlueprint, getProjectDetails } from "../../api/client";
import { downloadCombinedRustProject, downloadCargoToml } from "../../utils/exportRustCode";

export const HamburgerDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isHamburgerOpen, setHamburgerOpen, isDarkMode, toggleDarkMode } = useUiStore();
  const { logout, username } = useAuthStore();
  const [isExporting, setIsExporting] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const match = location.pathname.match(/\/projects\/([^/]+)/);
  const activeProjects = projects && projects.length > 0 ? projects : [];
  const savedProjectId = sessionStorage.getItem("ema_selected_project_id");
  const selectedProjectId = (match ? match[1] : savedProjectId) || (activeProjects[0] ? activeProjects[0].id : "proj-payment-gateway");
  const selectedProject = activeProjects.find((p) => p.id === selectedProjectId) || activeProjects[0];

  const { data: projectDetails } = useQuery({
    queryKey: ["project-details", selectedProjectId],
    queryFn: () => getProjectDetails(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  if (!isHamburgerOpen) return null;

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    if (targetId) {
      sessionStorage.setItem("ema_selected_project_id", targetId);
      let subPage = "blueprint";
      if (location.pathname.includes("/core-audit")) subPage = "core-audit";
      else if (location.pathname.includes("/impact-audit")) subPage = "impact-audit";
      else if (location.pathname.includes("/readiness")) subPage = "readiness";
      else if (location.pathname.includes("/blueprint")) subPage = "blueprint";
      else if (location.pathname.includes("/report")) subPage = "report";

      navigate(`/projects/${targetId}/${subPage}`);
      setHamburgerOpen(false);
    }
  };

  const handleDownloadRustCode = async () => {
    setIsExporting(true);
    try {
      const blueprint = await getBlueprint(selectedProjectId);
      downloadCombinedRustProject(selectedProjectId, selectedProject?.name || selectedProjectId, blueprint.steps || []);
    } catch {
      console.warn("Failed to download Rust code; fallback export.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCargoToml = () => {
    downloadCargoToml(selectedProject?.name || selectedProjectId);
  };

  const handleResyncAnalysis = () => {
    queryClient.invalidateQueries({ queryKey: ["blueprint", selectedProjectId] });
    queryClient.invalidateQueries({ queryKey: ["core-audit", selectedProjectId] });
    queryClient.invalidateQueries({ queryKey: ["impact-audit", selectedProjectId] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };


  const isRouteUnlocked = (label: string): boolean => {
    if (label.includes("Blueprint")) return true;
    if (label.includes("Core")) return true;

    const manualImpact = sessionStorage.getItem("ema_unlocked_impact-audit") === "true";
    const manualReadiness = sessionStorage.getItem("ema_unlocked_readiness") === "true";
    const manualReport = sessionStorage.getItem("ema_unlocked_report") === "true";

    if (label.includes("Impact")) {
      return manualImpact || manualReadiness || manualReport || !!projectDetails?.core_audit;
    }
    if (label.includes("Readiness")) {
      return manualReadiness || manualReport || (!!projectDetails?.core_audit && !!projectDetails?.impact_audit);
    }
    if (label.includes("Report")) {
      const blueprintSteps = projectDetails?.blueprint?.steps || [];
      const allApproved = blueprintSteps.length > 0 && blueprintSteps.every((s: any) => s.status === "approved");
      return manualReport || (!!projectDetails?.core_audit && !!projectDetails?.impact_audit && allApproved);
    }
    return true;
  };

  const projectNavItems = [
    { label: "Blueprint Review", path: `/projects/${selectedProjectId}/blueprint`, icon: GitPullRequest },
    { label: "Core Audit", path: `/projects/${selectedProjectId}/core-audit`, icon: Layers },
    { label: "Impact & Blast Radius", path: `/projects/${selectedProjectId}/impact-audit`, icon: Bolt },
    { label: "Readiness & Consensus", path: `/projects/${selectedProjectId}/readiness`, icon: BarChart3 },
    { label: "Migration Report", path: `/projects/${selectedProjectId}/report`, icon: FileCheck2 },
  ];

  const primaryNavItems = [
    { label: "Dashboard", path: "/", icon: MonitorPlay },
    { label: "Settings", path: "/settings", icon: SlidersHorizontal },
    { label: "Account", path: "/account", icon: CircuitBoard },
    { label: "Integrations", path: "/integrations", icon: Cable },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-mono">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setHamburgerOpen(false)}
      ></div>

      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col justify-between z-10 shadow-2xl p-5 overflow-y-auto transition-colors">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <img src="/cpu.png" alt="ALCHEMI Logo" className="w-6 h-6 rounded object-cover shadow-xs" />
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-wider">
                Navigation Menu
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
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 space-y-2">
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
              className="w-full flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 hover:border-amber-500 transition-colors text-xs text-zinc-800 dark:text-zinc-200"
            >
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-amber-500" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 font-bold">
                TOGGLE
              </span>
            </button>
          </div>

          {/* Active Project Selector */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-600 dark:text-amber-500 uppercase text-[10px] font-bold tracking-wider flex items-center space-x-1">
                <FolderGit className="w-3.5 h-3.5" />
                <span>Active Project</span>
              </span>
            </div>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={handleProjectSelect}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-6"
              >
                {activeProjects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Streamlined Project Pipeline Menu */}
          <div className="space-y-1">
            <span className="text-[10px] text-amber-600 dark:text-amber-500 uppercase tracking-widest block px-2 mb-1 font-bold">
              Analysis Pipeline
            </span>
            {projectNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const unlocked = isRouteUnlocked(item.label);
              const { addNotification } = useUiStore.getState();

              if (!unlocked) {
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() =>
                      addNotification(
                        `Stage Locked: Please complete the previous pipeline views in order: 1. Blueprint Review -> 2. Core Audit -> 3. Impact Audit -> 4. Readiness & Consensus -> 5. Migration Report.`,
                        "warning"
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 cursor-pointer text-left font-mono border-0 bg-transparent"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 shrink-0 opacity-40 text-zinc-400 dark:text-zinc-600" />
                      <span>{item.label}</span>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
                  </button>
                );
              }

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

          {/* Sidebar Downloads & Code Utilities */}
          <div className="space-y-1 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block px-2 mb-1 font-bold flex items-center justify-between">
              <span>Exports & Downloads</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500/70" />
            </span>

            <button
              type="button"
              onClick={handleDownloadRustCode}
              disabled={isExporting}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs text-zinc-800 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer text-left"
            >
              <FileTerminal className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Download Rust Code (.rs)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCargoToml}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs text-zinc-800 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer text-left"
            >
              <CloudDownload className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Download Cargo.toml</span>
            </button>

            <button
              type="button"
              onClick={handleResyncAnalysis}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded text-xs text-zinc-800 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer text-left"
            >
              <RefreshCcw className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Re-Sync Analysis</span>
            </button>
          </div>

          {/* Global Enterprise Nav */}
          <div className="space-y-1 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block px-2 mb-1 font-bold">
              Settings & Admin
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
                  <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-amber-600 dark:text-amber-500 text-xs">
                {username ? username.substring(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block truncate">
                  {username || "admin"}
                </span>
                <div className="flex items-center space-x-1 text-[10px] text-zinc-500">
                  <BadgeCheck className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>Engine Active</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setHamburgerOpen(false);
              }}
              className="p-1.5 rounded bg-zinc-200 dark:bg-zinc-800 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-600 text-center font-sans">
            EMA Pipeline v1.0.0 PROD • Java → Rust Engine
          </p>
        </div>
      </div>
    </div>
  );
};
