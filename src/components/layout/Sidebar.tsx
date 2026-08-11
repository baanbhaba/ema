import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MonitorPlay, FileScan, Bolt, SquareCheckBig, GitPullRequestArrow, ScanText, SlidersHorizontal, CircuitBoard, Cable, FolderGit, ChevronDown, CloudDownload, FileTerminal, RefreshCcw, Sparkles, Lock } from "lucide-react";
import { getProjects, getBlueprint, getProjectDetails } from "../../api/client";
import { useUiStore } from "../../store/useUiStore";
import { downloadCombinedRustProject, downloadCargoToml } from "../../utils/exportRustCode";

export const Sidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const activeProjects = projects && projects.length > 0 ? projects : [];
  const savedProjectId = sessionStorage.getItem("ema_selected_project_id");
  const selectedProjectId = id || savedProjectId || (activeProjects[0] ? activeProjects[0].id : "proj-payment-gateway");
  const selectedProject = activeProjects.find((p) => p.id === selectedProjectId) || activeProjects[0];

  useEffect(() => {
    if (id) {
      sessionStorage.setItem("ema_selected_project_id", id);
    }
  }, [id]);

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
    }
  };

  const handleDownloadRustCode = async () => {
    setIsExporting(true);
    try {
      const blueprint = await getBlueprint(selectedProjectId);
      downloadCombinedRustProject(selectedProjectId, selectedProject?.name || selectedProjectId, blueprint.steps || []);
    } catch (_err) {
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

  const { data: projectDetails } = useQuery({
    queryKey: ["project-details", selectedProjectId],
    queryFn: () => getProjectDetails(selectedProjectId),
    enabled: !!selectedProjectId,
  });

  const isRouteUnlocked = (label: string): boolean => {
    if (label === "Blueprint Review") return true;
    if (label === "Core Audit") return true;

    const manualImpact = sessionStorage.getItem("ema_unlocked_impact-audit") === "true";
    const manualReadiness = sessionStorage.getItem("ema_unlocked_readiness") === "true";
    const manualReport = sessionStorage.getItem("ema_unlocked_report") === "true";

    if (label === "Impact Audit") {
      return manualImpact || manualReadiness || manualReport || !!projectDetails?.core_audit;
    }
    if (label === "Readiness & Consensus") {
      return manualReadiness || manualReport || (!!projectDetails?.core_audit && !!projectDetails?.impact_audit);
    }
    if (label === "Migration Report") {
      const blueprintSteps = projectDetails?.blueprint?.steps || [];
      const allApproved = blueprintSteps.length > 0 && blueprintSteps.every((s: any) => s.status === "approved");
      return manualReport || (!!projectDetails?.core_audit && !!projectDetails?.impact_audit && allApproved);
    }
    return true;
  };

  const navItems = [
    {
      label: "Blueprint Review",
      path: `/projects/${selectedProjectId}/blueprint`,
      icon: GitPullRequestArrow,
    },
    {
      label: "Core Audit",
      path: `/projects/${selectedProjectId}/core-audit`,
      icon: FileScan,
    },
    {
      label: "Impact Audit",
      path: `/projects/${selectedProjectId}/impact-audit`,
      icon: Bolt,
    },
    {
      label: "Readiness & Consensus",
      path: `/projects/${selectedProjectId}/readiness`,
      icon: SquareCheckBig,
    },
    {
      label: "Migration Report",
      path: `/projects/${selectedProjectId}/report`,
      icon: ScanText,
    },
  ];

  const enterpriseItems = [
    { label: "Settings", path: "/settings", icon: SlidersHorizontal },
    { label: "Account", path: "/account", icon: CircuitBoard },
    { label: "Integrations", path: "/integrations", icon: Cable },
  ];

  return (
    <aside className="w-56 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)] font-mono text-xs hidden md:flex transition-colors text-zinc-900 dark:text-zinc-100">
      <div className="space-y-3">
        {/* Project Selector & Overview Header */}
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all ${
                isActive && !id
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`
            }
          >
            <MonitorPlay className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          {/* Active Project Switcher Dropdown */}
          <div className="bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded p-2 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">
              <span>Active Project</span>
              <FolderGit className="w-3 h-3 text-amber-500" />
            </div>

            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={handleProjectSelect}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded px-2 py-1 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-6"
              >
                {activeProjects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
            {selectedProject && (
              <div className="text-[10px] text-zinc-500 truncate pt-0.5">
                Stage: <span className="text-amber-600 dark:text-amber-400 font-bold uppercase">{selectedProject.stage.replace("_", " ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Streamlined Project Navigation Menu */}
        <div className="px-2 space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 flex items-center justify-between">
            <span>Analysis Pipeline</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const unlocked = isRouteUnlocked(item.label);
            const { addNotification } = useUiStore.getState();

            if (!unlocked) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    addNotification(
                      `Stage Locked: Please complete the previous pipeline views in order: 1. Blueprint Review -> 2. Core Audit -> 3. Impact Audit -> 4. Readiness & Consensus -> 5. Migration Report.`,
                      "warning"
                    )
                  }
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-all text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 cursor-pointer text-left font-mono text-xs border-0 bg-transparent"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5 shrink-0 opacity-40 text-zinc-400 dark:text-zinc-600" />
                    <span>{item.label}</span>
                  </div>
                  <Lock className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
                </button>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all ${
                    isActive
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500 shadow-2xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Export & Download Quick Utilities */}
        <div className="px-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Exports & Downloads</span>
            <Sparkles className="w-3 h-3 text-amber-500/70" />
          </div>

          <button
            type="button"
            onClick={handleDownloadRustCode}
            disabled={isExporting}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 text-xs transition-all cursor-pointer text-left"
            title="Download complete Rust Axum migrated source code"
          >
            <FileTerminal className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Download Rust (.rs)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCargoToml}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 text-xs transition-all cursor-pointer text-left"
            title="Download Cargo.toml dependencies file"
          >
            <CloudDownload className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Download Cargo.toml</span>
          </button>

          <button
            type="button"
            onClick={handleResyncAnalysis}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 text-xs transition-all cursor-pointer text-left"
            title="Refresh analysis cache"
          >
            <RefreshCcw className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Re-Sync Analysis</span>
          </button>
        </div>
      </div>

      {/* Settings & Admin Bottom Links */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 space-y-0.5">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Settings & Admin
        </div>
        {enterpriseItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all ${
                  isActive
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border-l-2 border-amber-500"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
