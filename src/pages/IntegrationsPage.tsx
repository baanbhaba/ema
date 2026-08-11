import React from "react";
import { Cable, GitFork, SquareTerminal, BadgeCheck, CircleCheckBig, ClipboardCopy, ExternalLink } from "lucide-react";
import { Card } from "../components/common/Card";

export const IntegrationsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  // Production webhook URLs for Vercel deployment
  const webhooks = [
    {
      name: "GitHub Actions Workflow",
      url: "https://alchemi-amber.vercel.app/api/webhooks/github",
      event: "push / PR merged",
      description: "Trigger migration analysis automatically when code is pushed or a PR is merged.",
    },
    {
      name: "GitLab CI Pipeline",
      url: "https://alchemi-amber.vercel.app/api/webhooks/gitlab",
      event: "pipeline_success",
      description: "Connect GitLab CI pipelines to automatically ingest and analyze new Java services.",
    },
    {
      name: "Jenkins Enterprise Trigger",
      url: "https://alchemi-amber.vercel.app/api/webhooks/jenkins",
      event: "build_complete",
      description: "Integrate with Jenkins builds to start migration audits on successful builds.",
    },
  ];

  const handleCopy = (url: string, idx: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>Integrations</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            Connect your CI/CD pipelines and toolchains to automate migration analysis triggers.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-xs">
          <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
          <span className="font-bold text-green-700 dark:text-green-400">Sandbox Ready</span>
        </div>
      </div>

      {/* Sandboxed Runtime Toolchains */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <SquareTerminal className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
            <span>Analysis Runtime Status</span>
          </div>
        }
        subtitle="Tree-sitter AST parser and dependency analyzer engine status"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Tree-Sitter AST Parser</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
                IDLE
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
              Supported grammars: Java, XML (pom.xml), Properties files
            </p>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Dependency Analyzer</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
                STANDBY
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans">
              Analyzes Maven POM dependencies and identifies transitive conflicts.
            </p>
          </div>
        </div>
      </Card>

      {/* CI/CD Webhooks */}
      <Card
        title={
          <div className="flex items-center space-x-2">
            <Cable className="w-3.5 h-3.5 text-amber-500" />
            <span>CI/CD Webhook Endpoints</span>
          </div>
        }
        subtitle="Configure these endpoints in your CI/CD platform to trigger migration analysis automatically"
      >
        <div className="space-y-3">
          {webhooks.map((w, idx) => (
            <div
              key={idx}
              className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <GitFork className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">{w.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-mono">
                      {w.event}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">{w.description}</p>
                  <code className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate font-mono">
                    {w.url}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(w.url, idx)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all shrink-0"
                  aria-label={`Copy webhook URL for ${w.name}`}
                >
                  {copiedIndex === idx ? (
                    <>
                      <CircleCheckBig className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center space-x-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
          <ExternalLink className="w-3 h-3 shrink-0" />
          <span>
            Configure these endpoints in your CI/CD platform's webhook settings. Requests must use POST with a JSON payload.
          </span>
        </div>
      </Card>
    </div>
  );
};
