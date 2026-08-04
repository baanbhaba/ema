import React from "react";
import { Plug, GitBranch, Terminal, ShieldCheck, CheckCircle2, Copy } from "lucide-react";
import { Card } from "../components/common/Card";

import { useUiStore } from "../store/useUiStore";

export const IntegrationsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const { notifyBackendRequired } = useUiStore();

  const webhooks = [
    { name: "GitHub Actions Workflow", url: "http://localhost:8080/api/v1/webhooks/github", event: "push / PR merged" },
    { name: "GitLab CI Pipeline", url: "http://localhost:8080/api/v1/webhooks/gitlab", event: "pipeline_success" },
    { name: "Jenkins Enterprise Trigger", url: "http://localhost:8080/api/v1/webhooks/jenkins", event: "build_complete" },
  ];

  const handleCopy = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(idx);
    notifyBackendRequired("CI/CD Webhook Trigger Endpoint");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>Integrations & Sandbox Toolchains</span>
            <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              (built in backend)
            </span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            CI/CD Webhook triggers, tree-sitter AST parser status, and Docker build environment checks.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Sandbox Engine Ready</span>
        </div>
      </div>

      {/* Sandboxed Runtime Toolchains */}
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>Sandboxed Runtime & Toolchain Status</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              (built in backend)
            </span>
          </div>
        }
        subtitle="Tree-sitter parser, petgraph dependency analyzer, and Docker JDK verification engines"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Tree-Sitter AST Parser</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                IDLE (0 AST Nodes)
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sans">Supported grammars: Java, XML (pom.xml), Properties</p>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Docker Daemon Socket</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold">
                STANDBY (0 Active Containers)
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sans">Images loaded: `openjdk:8-jdk-slim`, `eclipse-temurin:21-jdk`</p>
          </div>
        </div>
      </Card>

      {/* CI/CD Webhooks */}
      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Plug className="w-3.5 h-3.5 text-amber-500" />
              <span>CI/CD Webhook Trigger Endpoints</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              (built in backend)
            </span>
          </div>
        }
        subtitle="Trigger ingestion and audit steps automatically on repository commits"
      >
        <div className="space-y-3 font-mono">
          {webhooks.map((w, idx) => (
            <div
              key={idx}
              className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{w.name}</span>
                  <span className="text-[10px] text-zinc-400">({w.event})</span>
                </div>
                <code className="text-[11px] text-zinc-500 block truncate">{w.url}</code>
              </div>

              <button
                onClick={() => handleCopy(w.url, idx)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-800 dark:text-zinc-200 font-bold shrink-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {copiedIndex === idx ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-amber-500" />
                    <span className="text-amber-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy Webhook URL</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
