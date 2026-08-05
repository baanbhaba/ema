import React, { useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FileText,
  Zap,
  CheckSquare,
  GitCommit,
  FileCheck,
  Settings,
  User,
  Plug,
  FolderGit2,
  ChevronDown,
  Download,
  FileCode2,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { getProjects, getBlueprint } from "../../api/client";
import { downloadCombinedRustProject, downloadCargoToml } from "../../utils/exportRustCode";

export const Sidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const activeProjects = projects && projects.length > 0 ? projects : [];
  const selectedProjectId = id || (activeProjects[0] ? activeProjects[0].id : "proj-payment-gateway");
  const selectedProject = activeProjects.find((p) => p.id === selectedProjectId) || activeProjects[0];

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    if (targetId) {
      navigate(`/projects/${targetId}/blueprint`);
    }
  };

  const handleDownloadRustCode = async () => {
    setIsExporting(true);
    try {
      const blueprint = await getBlueprint(selectedProjectId);
      downloadCombinedRustProject(selectedProject?.name || selectedProjectId, blueprint.steps || []);
    } catch (_err) {
      console.warn("Failed to download Rust code; fallback export.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCargoToml = () => {
    downloadCargoToml(selectedProject?.name || selectedProjectId);
  };

  const handleResyncNvidiaAI = () => {
    queryClient.invalidateQueries({ queryKey: ["blueprint", selectedProjectId] });
    queryClient.invalidateQueries({ queryKey: ["core-audit", selectedProjectId] });
    queryClient.invalidateQueries({ queryKey: ["impact-audit", selectedProjectId] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const navItems = [
    {
      label: "Core Audit",
      path: `/projects/${selectedProjectId}/core-audit`,
      icon: FileText,
    },
    {
      label: "Impact Audit",
      path: `/projects/${selectedProjectId}/impact-audit`,
      icon: Zap,
    },
    {
      label: "Readiness & Consensus",
      path: `/projects/${selectedProjectId}/readiness`,
      icon: CheckSquare,
    },
    {
      label: "Blueprint Review",
      path: `/projects/${selectedProjectId}/blueprint`,
      icon: GitCommit,
    },
    {
      label: "Migration Report",
      path: `/projects/${selectedProjectId}/report`,
      icon: FileCheck,
    },
  ];

  const enterpriseItems = [
    { label: "API Settings", path: "/settings", icon: Settings },
    { label: "Account & Team", path: "/account", icon: User },
    { label: "Integrations", path: "/integrations", icon: Plug },
  ];

  return (
    <aside className="w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)] font-mono text-xs hidden md:flex transition-colors text-zinc-100">
      <div className="space-y-3">
        {/* Project Selector & Overview Header */}
        <div className="p-3 border-b border-zinc-800 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all ${
                isActive && !id
                  ? "bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          {/* Active Project Switcher Dropdown */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded p-2 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
              <span>Active Project</span>
              <FolderGit2 className="w-3 h-3 text-amber-500" />
            </div>

            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={handleProjectSelect}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500 appearance-none cursor-pointer pr-6"
              >
                {activeProjects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-100">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
            {selectedProject && (
              <div className="text-[10px] text-zinc-500 truncate pt-0.5">
                Stage: <span className="text-amber-400 font-bold uppercase">{selectedProject.stage.replace("_", " ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Streamlined Project Navigation Menu */}
        <div className="px-2 space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center justify-between">
            <span>Pipeline Views</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all ${
                    isActive
                      ? "bg-zinc-900 text-zinc-100 font-bold border-l-2 border-amber-500 shadow-2xs"
                      : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Export & Download Quick Utilities (Rarely Used Buttons Hosted in Sidebar) */}
        <div className="px-2 pt-2 border-t border-zinc-800 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Exports & Downloads</span>
            <Sparkles className="w-3 h-3 text-amber-500/70" />
          </div>

          <button
            type="button"
            onClick={handleDownloadRustCode}
            disabled={isExporting}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-zinc-200 hover:text-amber-400 text-xs transition-all cursor-pointer text-left"
            title="Download complete Rust Axum main source file"
          >
            <FileCode2 className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Download Rust (.rs)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCargoToml}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-zinc-200 hover:text-amber-400 text-xs transition-all cursor-pointer text-left"
            title="Download Cargo.toml dependencies file"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Download Cargo.toml</span>
          </button>

          <button
            type="button"
            onClick={handleResyncNvidiaAI}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-zinc-200 hover:text-amber-400 text-xs transition-all cursor-pointer text-left"
            title="Refresh and re-trigger live NVIDIA AI analysis"
          >
            <RotateCw className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Re-Sync NVIDIA AI</span>
          </button>
        </div>
      </div>

      {/* Enterprise Bottom Links */}
      <div className="p-2 border-t border-zinc-800 space-y-0.5">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Governance
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
                    ? "bg-zinc-900 text-zinc-100 font-bold border-l-2 border-amber-500"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100"
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
