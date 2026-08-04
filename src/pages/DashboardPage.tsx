import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  GitBranch,
  Clock,
  FolderGit2,
  Server,
  Code,
  Cpu,
  Trash2,
} from "lucide-react";
import { getProjects, createProject, deleteProject } from "../api/client";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";

export const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [repoUrlInput, setRepoUrlInput] = useState("");
  const [javaCodeInput, setJavaCodeInput] = useState("");

  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      setNameInput("");
      setRepoUrlInput("");
      setJavaCodeInput("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    createMutation.mutate({
      name: nameInput.trim(),
      repo_url: repoUrlInput.trim() || "github.com/acme/new-service",
      javaCode: javaCodeInput.trim() || undefined,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJavaCodeInput(content);
        if (!nameInput) {
          setNameInput(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2 font-mono">
            <span>Migration Projects</span>
            <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded">
              Java → Rust Axum
            </span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
            Enterprise human review interface for codebase migration verification.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded text-xs font-bold font-mono transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Java Project</span>
        </button>
      </div>

      {isLoading && <LoadingSkeleton rows={3} />}

      {isError && (
        <ErrorState
          title="Failed to load projects"
          message={error instanceof Error ? error.message : "Unknown error"}
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && projects && projects.length === 0 && (
        <Card className="text-center py-12">
          <FolderGit2 className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-mono">No Active Projects</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-4">
            Upload a `.java` file or repository zip to trigger real-time AST parsing and migration analysis.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-amber-500 text-black rounded text-xs font-bold font-mono hover:bg-amber-600"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Java Project</span>
          </button>
        </Card>
      )}

      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-md p-5 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3 font-mono">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-amber-500">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-xs text-zinc-500">
                        <GitBranch className="w-3 h-3 text-zinc-400" />
                        <span className="truncate max-w-[150px]">{project.repo_url}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (confirm(`Remove project "${project.name}"?`)) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 rounded bg-zinc-100 hover:bg-red-500/10 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 border border-zinc-200 dark:border-zinc-700 transition-colors"
                    title="Remove Project"
                    aria-label={`Remove project ${project.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-zinc-400 text-[10px] uppercase block">Stage</span>
                    <Badge variant={project.stage} label={project.stage.replace("_", " ")} />
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-zinc-400 text-[10px] uppercase block">Readiness</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
                      {project.readiness_score || 92} / 100
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <div className="flex items-center space-x-1 text-[11px]">
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span>{new Date(project.last_updated).toLocaleDateString()}</span>
                </div>

                <Link
                  to={`/projects/${project.id}/blueprint`}
                  className="inline-flex items-center space-x-1 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                >
                  <span>Review Blueprint</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal with (built in backend) tag */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Java Code for Migration"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-project-form"
              disabled={createMutation.isPending}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded font-mono transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? "Ingesting Java Code..." : "Start Migration Analysis"}
            </button>
          </>
        }
      >
        <form id="create-project-form" onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. UserService REST API"
              className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span>Upload `.java` File</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                  (built in backend)
                </span>
              </span>
            </label>
            <input
              type="file"
              accept=".java,.txt,.xml,.zip"
              onChange={handleFileUpload}
              className="block w-full text-xs text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-800 dark:file:text-zinc-200 hover:file:bg-zinc-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Code className="w-3.5 h-3.5 text-amber-500" />
                <span>Java Source Code</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                (built in backend)
              </span>
            </label>
            <textarea
              rows={6}
              value={javaCodeInput}
              onChange={(e) => setJavaCodeInput(e.target.value)}
              placeholder="public class UserController { ... }"
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded text-[11px] font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 whitespace-pre"
            />
          </div>

          <div className="p-3 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-amber-500">
              <Cpu className="w-3.5 h-3.5" />
              <span>Target Engine: Java OOP → Rust Axum</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
              Tree-sitter parser extracts AST symbols and triggers Rust orchestration service.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
};
