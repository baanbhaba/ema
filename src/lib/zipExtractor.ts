/**
 * ZipExtractor — Extracts and sanitizes .zip archives containing Java projects.
 *
 * Supports Maven (src/main/java/**) and Gradle multi-module structures.
 * Builds a normalized file tree and returns a flat map of path → content.
 */

import JSZip from "jszip";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
  /** File size in bytes */
  size?: number;
  /** Language detected from extension */
  lang?: string;
}

export interface ZipExtractionResult {
  /** Flat map of file path → content string */
  files: Record<string, string>;
  /** Nested file tree for the UI */
  tree: FileTreeNode[];
  /** Number of Java files found */
  javaFileCount: number;
  /** Combined Java source code (all .java files joined) */
  combinedJavaCode: string;
  /** Detected project type */
  projectType: "maven" | "gradle" | "plain" | "unknown";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = new Set([
  ".java", ".kt", ".xml", ".gradle", ".properties",
  ".yml", ".yaml", ".json", ".md", ".txt", ".toml",
]);

const IGNORED_PATHS = [
  /^__MACOSX\//,
  /\/\.DS_Store$/,
  /\/\.git\//,
  /\/node_modules\//,
  /\/target\//,
  /\/build\//,
  /\/\.idea\//,
  /\/\.gradle\//,
  /\.class$/,
  /\.jar$/,
];

const LANG_MAP: Record<string, string> = {
  ".java": "java",
  ".kt": "kotlin",
  ".xml": "xml",
  ".gradle": "groovy",
  ".properties": "properties",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".json": "json",
  ".md": "markdown",
  ".toml": "toml",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx);
}

function shouldInclude(path: string): boolean {
  if (IGNORED_PATHS.some((re) => re.test(path))) return false;
  const ext = getExtension(path);
  return ALLOWED_EXTENSIONS.has(ext);
}

function detectProjectType(paths: string[]): "maven" | "gradle" | "plain" | "unknown" {
  if (paths.some((p) => p.endsWith("pom.xml"))) return "maven";
  if (paths.some((p) => p.endsWith("build.gradle") || p.endsWith("build.gradle.kts"))) return "gradle";
  if (paths.some((p) => p.endsWith(".java"))) return "plain";
  return "unknown";
}

/** Strip common top-level wrapper directory (e.g. "my-project-main/") */
function stripRootWrapper(paths: string[]): string {
  const roots = new Set(paths.map((p) => p.split("/")[0]));
  if (roots.size === 1) {
    const root = [...roots][0];
    // Only strip if it looks like a wrapper folder, not a source root
    if (!root.endsWith(".java") && !root.endsWith(".xml")) {
      return root + "/";
    }
  }
  return "";
}

/** Build a nested FileTreeNode[] from a flat list of paths */
function buildTree(paths: string[], files: Record<string, string>): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const dirMap: Record<string, FileTreeNode> = {};

  const sortedPaths = [...paths].sort();

  for (const path of sortedPaths) {
    const parts = path.split("/");
    let currentLevel = root;
    let cumulativePath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      cumulativePath = cumulativePath ? `${cumulativePath}/${part}` : part;
      const isLast = i === parts.length - 1;

      if (isLast) {
        // File node
        const ext = getExtension(part);
        const content = files[path] ?? "";
        currentLevel.push({
          name: part,
          path,
          type: "file",
          size: new TextEncoder().encode(content).length,
          lang: LANG_MAP[ext] ?? "text",
        });
      } else {
        // Directory node — reuse if already created
        let dir = dirMap[cumulativePath];
        if (!dir) {
          dir = { name: part, path: cumulativePath, type: "directory", children: [] };
          dirMap[cumulativePath] = dir;
          currentLevel.push(dir);
        }
        currentLevel = dir.children!;
      }
    }
  }

  return root;
}

// ─── Main extractor ───────────────────────────────────────────────────────────

export async function extractZip(file: File): Promise<ZipExtractionResult> {
  const zip = await JSZip.loadAsync(file);

  const rawFiles: Record<string, string> = {};
  const readPromises: Promise<void>[] = [];

  zip.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;
    if (!shouldInclude(relativePath)) return;

    readPromises.push(
      zipEntry.async("string").then((content) => {
        rawFiles[relativePath] = content;
      })
    );
  });

  await Promise.all(readPromises);

  const allPaths = Object.keys(rawFiles);
  const prefix = stripRootWrapper(allPaths);

  // Normalize paths: strip the common root wrapper
  const files: Record<string, string> = {};
  for (const [path, content] of Object.entries(rawFiles)) {
    const normalizedPath = prefix ? path.slice(prefix.length) : path;
    if (normalizedPath) files[normalizedPath] = content;
  }

  const normalizedPaths = Object.keys(files);
  const projectType = detectProjectType(normalizedPaths);

  // Collect Java files, prioritizing src/main/java for Maven/Gradle
  const javaPaths = normalizedPaths
    .filter((p) => p.endsWith(".java"))
    .sort((a, b) => {
      const aMain = a.includes("src/main/java") ? 0 : 1;
      const bMain = b.includes("src/main/java") ? 0 : 1;
      return aMain - bMain || a.localeCompare(b);
    });

  const combinedJavaCode = javaPaths
    .map((p) => `// === ${p} ===\n${files[p]}`)
    .join("\n\n");

  const tree = buildTree(normalizedPaths, files);

  return {
    files,
    tree,
    javaFileCount: javaPaths.length,
    combinedJavaCode,
    projectType,
  };
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
