/**
 * FileTreeView — Interactive nested file tree for browsing extracted ZIP contents.
 *
 * Features:
 * - Collapsible directory nodes with animated chevrons
 * - File icons mapped to language/extension
 * - Click a file to select it and preview its content
 * - Search/filter across all file paths
 * - Keyboard accessible
 */

import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  File,
  Search,
  X,
} from "lucide-react";
import type { FileTreeNode } from "../../lib/zipExtractor";
import { formatFileSize } from "../../lib/zipExtractor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileTreeViewProps {
  tree: FileTreeNode[];
  selectedPath?: string;
  onSelectFile: (path: string, content: string) => void;
  files: Record<string, string>;
  className?: string;
}

// ─── File icon helper ─────────────────────────────────────────────────────────

function FileIcon({ lang, className }: { lang?: string; className?: string }) {
  const cls = className ?? "w-3.5 h-3.5";
  switch (lang) {
    case "java":
    case "kotlin":
    case "groovy":
      return <FileCode className={`${cls} text-amber-500`} />;
    case "json":
      return <FileJson className={`${cls} text-blue-400`} />;
    case "xml":
    case "yaml":
    case "toml":
    case "properties":
      return <FileText className={`${cls} text-emerald-400`} />;
    case "markdown":
      return <FileText className={`${cls} text-zinc-400`} />;
    default:
      return <File className={`${cls} text-zinc-400`} />;
  }
}

// ─── Single tree node ─────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: FileTreeNode;
  depth: number;
  selectedPath?: string;
  onSelectFile: (path: string, content: string) => void;
  files: Record<string, string>;
  searchQuery: string;
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelectFile,
  files,
  searchQuery,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isSelected = selectedPath === node.path;

  // Filter: hide nodes that don't match search
  if (searchQuery && node.type === "file") {
    if (!node.path.toLowerCase().includes(searchQuery.toLowerCase())) return null;
  }

  if (node.type === "directory") {
    const hasMatchingChildren = searchQuery
      ? hasMatchingDescendant(node, searchQuery)
      : true;
    if (!hasMatchingChildren) return null;

    const openDir = isOpen || !!searchQuery;

    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center space-x-1.5 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors group"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          aria-expanded={openDir}
        >
          <ChevronRight
            className={`w-3 h-3 text-zinc-400 shrink-0 transition-transform duration-150 ${openDir ? "rotate-90" : ""}`}
          />
          {openDir ? (
            <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
            {node.name}
          </span>
        </button>

        {openDir && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
                files={files}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // File node
  return (
    <button
      type="button"
      onClick={() => onSelectFile(node.path, files[node.path] ?? "")}
      className={`w-full flex items-center space-x-1.5 px-2 py-1 rounded text-left transition-colors ${
        isSelected
          ? "bg-amber-500/10 border-l-2 border-amber-500 text-zinc-900 dark:text-zinc-100"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
      }`}
      style={{ paddingLeft: `${depth * 12 + 8 + 16}px` }}
      title={node.path}
    >
      <FileIcon lang={node.lang} />
      <span className="text-xs truncate flex-1">{node.name}</span>
      {node.size !== undefined && (
        <span className="text-[10px] text-zinc-400 shrink-0 ml-1">
          {formatFileSize(node.size)}
        </span>
      )}
    </button>
  );
}

function hasMatchingDescendant(node: FileTreeNode, query: string): boolean {
  if (node.type === "file") {
    return node.path.toLowerCase().includes(query.toLowerCase());
  }
  return node.children?.some((c) => hasMatchingDescendant(c, query)) ?? false;
}

// ─── Main component ───────────────────────────────────────────────────────────

export const FileTreeView: React.FC<FileTreeViewProps> = ({
  tree,
  selectedPath,
  onSelectFile,
  files,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const totalFiles = useMemo(() => Object.keys(files).length, [files]);
  const javaFiles = useMemo(
    () => Object.keys(files).filter((p) => p.endsWith(".java")).length,
    [files]
  );

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-mono">
            Project Files
          </span>
          <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono">
            <span>{totalFiles} files</span>
            <span>·</span>
            <span className="text-amber-500">{javaFiles} .java</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter files..."
            className="w-full pl-6 pr-6 py-1 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded focus:outline-none focus:border-amber-500 transition-colors text-zinc-800 dark:text-zinc-200 placeholder-zinc-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-6 font-mono">No files found</p>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              depth={0}
              selectedPath={selectedPath}
              onSelectFile={onSelectFile}
              files={files}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>
    </div>
  );
};
