import React from "react";

interface DiffViewerProps {
  diff: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ diff }) => {
  const lines = diff.split("\n");

  return (
    <div className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded p-3 font-mono text-xs overflow-x-auto leading-relaxed">
      {lines.map((line, idx) => {
        let style = "text-zinc-400";
        let bg = "";

        if (line.startsWith("+") && !line.startsWith("+++")) {
          style = "text-emerald-400 font-semibold";
          bg = "bg-emerald-950/30 -mx-3 px-3 block";
        } else if (line.startsWith("-") && !line.startsWith("---")) {
          style = "text-red-400 opacity-90 line-through";
          bg = "bg-red-950/30 -mx-3 px-3 block";
        } else if (line.startsWith("@")) {
          style = "text-amber-400 font-bold";
          bg = "bg-zinc-900 -mx-3 px-3 block";
        } else if (line.startsWith("---") || line.startsWith("+++")) {
          style = "text-zinc-500 font-bold";
        }

        return (
          <div key={idx} className={`${bg} ${style} whitespace-pre`}>
            {line}
          </div>
        );
      })}
    </div>
  );
};
