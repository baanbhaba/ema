import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileScan, Bolt, GitPullRequestArrow, UserCheck, Microchip, CircleCheckBig, FileCheck2, MoveRight, Sparkles, Info } from "lucide-react";
import { Modal } from "./Modal";

export interface PipelineStageInfo {
  id: number;
  title: string;
  shortLabel: string;
  icon: React.ElementType;
  routeSuffix: string;
  description: string;
  whatItDoes: string[];
  inputs: string[];
  outputs: string[];
  statusNote: string;
}

export const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    id: 1,
    title: "1. Upload Project",
    shortLabel: "Upload",
    icon: UploadCloud,
    routeSuffix: "",
    description: "Ingests Java 8 source code, repository zip files, or inline class definitions.",
    whatItDoes: [
      "Stores original source code in local session memory.",
      "Identifies class structures, imports, and package boundaries.",
      "Prepares project metadata for AI and AST parsing pipeline.",
    ],
    inputs: [".java files", "Application repository", "Source code snippets"],
    outputs: ["Project Summary Record", "AST Token Store"],
    statusNote: "Ready / Completed upon upload",
  },
  {
    id: 2,
    title: "2. Core Architecture Audit",
    shortLabel: "Core Audit",
    icon: FileScan,
    routeSuffix: "core-audit",
    description: "Analyzes legacy Java frameworks, deprecated APIs, and dependency coupling.",
    whatItDoes: [
      "Scans for EOL dependencies like Spring Boot 2.x and Java 8 javax.* imports.",
      "Executes live NVIDIA Llama 3.1 70B AI architecture audit.",
      "Generates Mermaid component diagrams for dependency visualization.",
    ],
    inputs: ["Java Source Code", "pom.xml / build.gradle"],
    outputs: ["Core Audit JSON", "Mermaid Architecture Diagrams"],
    statusNote: "Executed via NVIDIA AI Engine",
  },
  {
    id: 3,
    title: "3. Impact & Blast Radius Analysis",
    shortLabel: "Impact Audit",
    icon: Bolt,
    routeSuffix: "impact-audit",
    description: "Evaluates breaking change risks across API surface, database, and config layers.",
    whatItDoes: [
      "Maps blast radius of migrating Java controllers to Rust Axum routes.",
      "Identifies database dialect and JPA/Hibernate migration risks.",
      "Assesses configuration file updates (application.properties -> environment variables).",
    ],
    inputs: ["Core Audit Result", "API Annotations"],
    outputs: ["Blast Radius Matrix", "Risk Categorization"],
    statusNote: "Live AI Risk Assessment",
  },
  {
    id: 4,
    title: "4. Migration Blueprint Generation",
    shortLabel: "Blueprint",
    icon: GitPullRequestArrow,
    routeSuffix: "blueprint",
    description: "Decomposes monolithic Java code into ordered micro-step migration units.",
    whatItDoes: [
      "Creates step-by-step transformation targets for each Java class.",
      "Establishes dependency ordering between migration units.",
      "Prepares initial target pattern snippets for human architect review.",
    ],
    inputs: ["Core Audit", "Impact Audit"],
    outputs: ["Migration Blueprint Schema", "Step Execution Sequence"],
    statusNote: "AI-Generated & Human-Verifiable",
  },
  {
    id: 5,
    title: "5. Human Architect Review",
    shortLabel: "Human Review",
    icon: UserCheck,
    routeSuffix: "blueprint",
    description: "Allows lead architects to inspect, approve, reject, or edit migration steps.",
    whatItDoes: [
      "Provides strict approval gating before code generation.",
      "Enforces required rejection reasons for full auditability.",
      "Allows manual overrides of target patterns and migration rationale.",
    ],
    inputs: ["Migration Blueprint"],
    outputs: ["Approved Blueprint Steps", "Reviewer Audit Trail"],
    statusNote: "Human-in-the-Loop Gatekeeper",
  },
  {
    id: 6,
    title: "6. Live Code Transformation",
    shortLabel: "Transformation",
    icon: Microchip,
    routeSuffix: "blueprint",
    description: "Executes live NVIDIA Llama 3.1 70B AI model code generation to produce Rust Axum target code.",
    whatItDoes: [
      "Applies strict domain preservation rules (CLI vs REST Axum handlers).",
      "Generates compilable Rust 2024 source code with Axum 0.7 syntax.",
      "Sanitizes markdown fences and extracts pure Rust source.",
    ],
    inputs: ["Approved Java Step", "NVIDIA Llama 3.1 70B Model Prompt"],
    outputs: ["Target Rust Source Code (.rs)", "Axum Handler Definitions"],
    statusNote: "Live AI Synthesis",
  },
  {
    id: 7,
    title: "7. AST & Type Validation",
    shortLabel: "Validation",
    icon: CircleCheckBig,
    routeSuffix: "readiness",
    description: "Verifies generated target code against readiness scores and unified consensus.",
    whatItDoes: [
      "Validates synthetic test pass rates and syntax completeness.",
      "Computes overall migration readiness score (0-100 scale).",
      "Resolves potential cross-agent architectural conflicts.",
    ],
    inputs: ["Transformed Rust Code", "Readiness Evaluator"],
    outputs: ["Readiness Breakdown Score", "Consensus Matrix"],
    statusNote: "Automated Sandbox Verification",
  },
  {
    id: 8,
    title: "8. Migration Report & Rollback Plan",
    shortLabel: "Final Report",
    icon: FileCheck2,
    routeSuffix: "report",
    description: "Compiles complete side-by-side diffs, audit trails, and automatic rollback strategies.",
    whatItDoes: [
      "Generates unified unified diffs (Java vs Rust).",
      "Creates step-by-step SQL/Git rollback instructions.",
      "Exports complete Cargo.toml and Rust microservice package for production deployment.",
    ],
    inputs: ["All Pipeline Artifacts"],
    outputs: ["Final Migration Report", "Deployable Rust Workspace Zip / Cargo.toml"],
    statusNote: "Production Deployment Ready",
  },
];

interface PipelineNarrativeBannerProps {
  projectId?: string;
  currentStepId?: number;
}

export const PipelineNarrativeBanner: React.FC<PipelineNarrativeBannerProps> = ({
  projectId = "proj-payment-gateway",
  currentStepId,
}) => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<PipelineStageInfo | null>(null);

  const handleStageClick = (stage: PipelineStageInfo) => {
    setSelectedStage(stage);
  };

  const handleNavigate = (routeSuffix: string) => {
    if (!routeSuffix) {
      navigate("/");
    } else {
      navigate(`/projects/${projectId}/${routeSuffix}`);
    }
    setSelectedStage(null);
  };

  return (
    <>
      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/30 rounded-lg text-xs font-mono space-y-3 shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-[11px] uppercase font-bold text-amber-600 dark:text-amber-500 tracking-wider">
              EMA Codebase Migration Pipeline Narrative
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-sans">
            Click any step to inspect stage actions & narrative
          </span>
        </div>

        {/* Interactive Clickable Steps */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = currentStepId === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  type="button"
                  onClick={() => handleStageClick(stage)}
                  className={`group inline-flex items-center space-x-1.5 px-2.5 py-1 rounded border transition-all cursor-pointer text-left ${
                    isCurrent
                      ? "bg-amber-500 text-black border-amber-400 font-bold shadow-xs scale-102"
                      : "bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 border-zinc-300 dark:border-zinc-700 hover:border-amber-500/50"
                  }`}
                  title={`Click to view details for ${stage.title}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-black" : "text-amber-500 group-hover:scale-110 transition-transform"}`} />
                  <span>{stage.title}</span>
                </button>
                {idx < PIPELINE_STAGES.length - 1 && (
                  <span className="text-zinc-400 dark:text-zinc-600 select-none">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Explanation Modal */}
      {selectedStage && (
        <Modal
          isOpen={!!selectedStage}
          onClose={() => setSelectedStage(null)}
          title={`Pipeline Narrative: ${selectedStage.title}`}
          maxWidth="xl"
          footer={
            <div className="flex items-center justify-between w-full font-mono">
              <span className="text-[11px] text-zinc-500 flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span>Active Target: {projectId}</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedStage(null)}
                  className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate(selectedStage.routeSuffix)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded transition-colors"
                >
                  <span>Go to {selectedStage.shortLabel} View</span>
                  <MoveRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-900 dark:text-amber-300 font-sans leading-relaxed">
              {selectedStage.description}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase text-[10px] tracking-wider">
                What the Engine Executes at this Stage
              </h4>
              <ul className="space-y-1 bg-zinc-50 dark:bg-zinc-900 p-3 rounded border border-zinc-200 dark:border-zinc-800">
                {selectedStage.whatItDoes.map((item, i) => (
                  <li key={i} className="flex items-start space-x-2 text-zinc-800 dark:text-zinc-300">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded space-y-1">
                <h5 className="font-bold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase">Input Artifacts</h5>
                <ul className="space-y-0.5 text-zinc-800 dark:text-zinc-300">
                  {selectedStage.inputs.map((inp, i) => (
                    <li key={i}>→ {inp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded space-y-1">
                <h5 className="font-bold text-zinc-500 dark:text-zinc-400 text-[10px] uppercase">Produced Outputs</h5>
                <ul className="space-y-0.5 text-zinc-800 dark:text-zinc-300">
                  {selectedStage.outputs.map((out, i) => (
                    <li key={i}>✓ {out}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-2.5 bg-zinc-100 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[11px]">
              <span>Pipeline Stage Status:</span>
              <span className="font-bold text-amber-600 dark:text-amber-500">{selectedStage.statusNote}</span>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
