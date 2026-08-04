import React from "react";
import { Card } from "../components/common/Card";

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 font-mono">
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          System Settings
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
          LLM provider orchestration, API keys, and model selections are managed centrally by the Rust backend service.
        </p>
      </div>

      <Card
        title="Backend Orchestration Architecture"
        subtitle="Frontend API Configuration Status"
      >
        <div className="p-4 text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
          <p>
            • <strong>Backend Endpoint:</strong> Configured via REST API client at <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">http://localhost:8080/api/v1</code>.
          </p>
          <p>
            • <strong>Security & Compliance:</strong> The frontend does not store, request, or handle LLM API keys.
          </p>
        </div>
      </Card>
    </div>
  );
};
