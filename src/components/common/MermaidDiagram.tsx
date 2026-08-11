import React, { useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isDarkMode } = useUiStore();

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        setIsLoading(true);
        setRenderError(null);

        // Dynamically load mermaid only when a diagram actually needs rendering (saves ~650kB initial bundle)
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: isDarkMode ? "dark" : "default",
          securityLevel: "loose",
          themeVariables: {
            isDarkMode,
            background: isDarkMode ? "#18181b" : "#ffffff",
            primaryColor: isDarkMode ? "#27272a" : "#f4f4f5",
            primaryTextColor: isDarkMode ? "#fafafa" : "#09090b",
            primaryBorderColor: isDarkMode ? "#3f3f46" : "#e4e4e7",
            lineColor: isDarkMode ? "#a1a1aa" : "#71717a",
            secondaryColor: isDarkMode ? "#27272a" : "#e4e4e7",
            tertiaryColor: isDarkMode ? "#3f3f46" : "#d4d4d8",
          },
        });

        const cleanId = `mermaid-${id.replace(/[^a-zA-Z0-9]/g, "-")}`;
        // Sanitize single quotes in Mermaid diagram definitions to prevent parser crashes
        let sanitizedChart = chart;
        sanitizedChart = sanitizedChart.replace(/\bas\s+'([^']*)'/g, 'as "$1"');
        sanitizedChart = sanitizedChart.replace(/\bparticipant\s+'([^']*)'/g, 'participant "$1"');
        sanitizedChart = sanitizedChart.replace(/\[\s*'([^']*)'\s*\]/g, '["$1"]');
        sanitizedChart = sanitizedChart.replace(/\(\s*'([^']*)'\s*\)/g, '("$1")');

        const { svg } = await mermaid.render(cleanId, sanitizedChart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        if (isMounted) {
          setRenderError(err instanceof Error ? err.message : "Failed to render Mermaid diagram");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, id, isDarkMode]);

  if (renderError) {
    return (
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-xs text-amber-400 font-mono space-y-1">
        <div className="flex items-center space-x-1.5 font-bold">
          <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Diagram Render Warning</span>
        </div>
        <p className="text-[11px] font-sans text-amber-300">
          Raw representation retained for audit trace.
        </p>
        <pre className="mt-2 p-2 bg-zinc-950 border border-zinc-800 rounded text-[10px] text-zinc-400 overflow-x-auto whitespace-pre">
          {chart}
        </pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded flex items-center justify-center space-x-2 text-xs text-zinc-400 font-mono animate-pulse">
        <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span>Rendering diagram...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded overflow-x-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
