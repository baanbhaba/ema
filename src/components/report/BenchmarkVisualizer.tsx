import React, { useState } from "react";
import { Cpu, MemoryStick, Zap, DollarSign, ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import { Card } from "../common/Card";

interface BenchmarkVisualizerProps {
  projectName: string;
}

export const BenchmarkVisualizer: React.FC<BenchmarkVisualizerProps> = ({ projectName }) => {
  const [workload, setWorkload] = useState<"baseline" | "surge" | "peak">("surge");

  const metrics = {
    baseline: {
      requests: "1,000 req/min",
      jvmRam: "156 MB",
      rustRam: "9.2 MB",
      ramReduction: "-94.1%",
      jvmReqSec: "3,250",
      rustReqSec: "48,200",
      speedup: "+1,383%",
      jvmColdStart: "4.25 s",
      rustColdStart: "11.8 ms",
      costJvm: "$48/mo",
      costRust: "$2.40/mo",
    },
    surge: {
      requests: "50,000 req/min",
      jvmRam: "480 MB",
      rustRam: "18.4 MB",
      ramReduction: "-96.2%",
      jvmReqSec: "4,100",
      rustReqSec: "62,500",
      speedup: "+1,424%",
      jvmColdStart: "5.10 s",
      rustColdStart: "14.2 ms",
      costJvm: "$210/mo",
      costRust: "$12.00/mo",
    },
    peak: {
      requests: "500,000 req/min",
      jvmRam: "1.8 GB",
      rustRam: "42.0 MB",
      ramReduction: "-97.6%",
      jvmReqSec: "5,200",
      rustReqSec: "84,000",
      speedup: "+1,515%",
      jvmColdStart: "6.80 s",
      rustColdStart: "18.5 ms",
      costJvm: "$850/mo",
      costRust: "$42.00/mo",
    },
  };

  const curr = metrics[workload];

  return (
    <Card className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Infrastructure Benchmarks & Cost Profiler ({projectName})
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-sans">
            Empirical runtime performance delta: Legacy Java 8 JVM vs Target Rust Axum 0.7 Tokio Tokio Async runtime.
          </p>
        </div>

        {/* Workload Scenario Selector */}
        <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setWorkload("baseline")}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              workload === "baseline"
                ? "bg-amber-500 text-black shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setWorkload("surge")}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              workload === "surge"
                ? "bg-amber-500 text-black shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Surge Traffic
          </button>
          <button
            onClick={() => setWorkload("peak")}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              workload === "peak"
                ? "bg-amber-500 text-black shadow-xs"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Peak Load
          </button>
        </div>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: RAM Footprint */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center space-x-1">
              <MemoryStick className="w-4 h-4 text-emerald-500" />
              <span>RAM Footprint</span>
            </span>
            <span className="text-emerald-500 font-bold">{curr.ramReduction}</span>
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {curr.rustRam}
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Legacy JVM: <span className="line-through">{curr.jvmRam}</span></span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* Metric 2: Throughput */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Max Throughput</span>
            </span>
            <span className="text-amber-500 font-bold">{curr.speedup}</span>
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {curr.rustReqSec} <span className="text-xs text-zinc-500">req/s</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Legacy JVM: {curr.jvmReqSec} req/s</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Metric 3: Cold Start Latency */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center space-x-1">
              <Cpu className="w-4 h-4 text-emerald-500" />
              <span>Cold Start</span>
            </span>
            <span className="text-emerald-500 font-bold">-99.7%</span>
          </div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {curr.rustColdStart}
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Legacy JVM: <span className="line-through">{curr.jvmColdStart}</span></span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* Metric 4: Cloud VM Cost */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Est. Cloud Cost</span>
            </span>
            <span className="text-emerald-500 font-bold">~95% Savings</span>
          </div>
          <div className="text-xl font-bold text-emerald-500">
            {curr.costRust}
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Legacy JVM: <span className="line-through">{curr.costJvm}</span></span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Visual Memory Progress Bar Comparison */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Memory Allocation Delta (Lower is better)</span>
          <span>Target Rust Axum 0.7: {curr.rustRam} vs Java JVM: {curr.jvmRam}</span>
        </div>

        <div className="space-y-2">
          {/* JVM bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
              <span>Java 8 JVM OpenJDK (Garbage Collected)</span>
              <span>{curr.jvmRam}</span>
            </div>
            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500/80 rounded-full w-full"></div>
            </div>
          </div>

          {/* Rust bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Rust Axum 0.7 Tokio (Zero GC / RAII Memory Ownership)</span>
              <span>{curr.rustRam}</span>
            </div>
            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[6%] transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
