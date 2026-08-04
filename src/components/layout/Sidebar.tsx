import React from "react";
import { NavLink, useParams } from "react-router-dom";
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
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navItems = id
    ? [
        {
          label: "Core Audit",
          path: `/projects/${id}/core-audit`,
          icon: FileText,
        },
        {
          label: "Impact Audit",
          path: `/projects/${id}/impact-audit`,
          icon: Zap,
        },
        {
          label: "Consensus / Readiness",
          path: `/projects/${id}/readiness`,
          icon: CheckSquare,
        },
        {
          label: "Blueprint Review",
          path: `/projects/${id}/blueprint`,
          icon: GitCommit,
        },
        {
          label: "Migration Report",
          path: `/projects/${id}/report`,
          icon: FileCheck,
        },
      ]
    : [];

  const enterpriseItems = [
    { label: "API & Models", path: "/settings", icon: Settings },
    { label: "Account & Team", path: "/account", icon: User },
    { label: "Integrations", path: "/integrations", icon: Plug },
  ];

  return (
    <aside className="w-52 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)] font-mono text-xs hidden md:flex transition-colors">
      <div>
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-2.5 py-1.5 rounded transition-colors ${
                isActive
                  ? "bg-zinc-200 text-zinc-900 font-bold dark:bg-zinc-900 dark:text-zinc-100 border-l-2 border-amber-500"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-900"
              }`
            }
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
            <span>All Projects</span>
          </NavLink>
        </div>

        {id ? (
          <div className="p-2 space-y-0.5">
            <div className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Pipeline Views
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-2.5 py-2 rounded transition-all ${
                      isActive
                        ? "bg-zinc-900 text-zinc-100 font-bold border-l-2 border-amber-500 shadow-2xs dark:bg-zinc-900"
                        : "text-zinc-700 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-900/60"
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ) : (
          <div className="p-3 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-2 font-sans">
            <div className="font-semibold text-zinc-800 dark:text-zinc-300 font-mono">Select Project</div>
            <p className="leading-relaxed">
              Review core audits, consensus metrics, and transformation blueprints.
            </p>
          </div>
        )}
      </div>

      {/* Enterprise Bottom Links */}
      <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 space-y-0.5">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
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
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 font-bold border-l-2 border-amber-500"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-900/60"
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
