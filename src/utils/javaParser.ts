export interface ParsedJavaFile {
  fileName: string;
  className: string;
  packageName: string;
  imports: string[];
  annotations: string[];
  methods: {
    name: string;
    returnType: string;
    parameters: string;
    isPublic: boolean;
  }[];
  fields: {
    name: string;
    type: string;
    annotations: string[];
  }[];
  rawCode: string;
  loc: number;
}

export interface ParsedJavaProject {
  projectName: string;
  files: ParsedJavaFile[];
  totalLoc: number;
  detectedClasses: string[];
  detectedControllers: string[];
  detectedServices: string[];
  detectedRepositories: string[];
}

export const parseJavaCode = (fileName: string, rawCode: string): ParsedJavaFile => {
  const lines = rawCode.split("\n");
  const loc = lines.filter((l) => l.trim().length > 0 && !l.trim().startsWith("//")).length;

  // Package matching
  const packageMatch = rawCode.match(/package\s+([\w.]+);/);
  const packageName = packageMatch ? packageMatch[1] : "default";

  // Class name matching
  const classMatch = rawCode.match(/(?:public\s+)?(?:class|interface|enum)\s+(\w+)/);
  const className = classMatch ? classMatch[1] : fileName.replace(".java", "");

  // Imports matching
  const importMatches = Array.from(rawCode.matchAll(/import\s+([\w.*]+);/g));
  const imports = importMatches.map((m) => m[1]);

  // Class level annotations matching
  const annotationMatches = Array.from(rawCode.matchAll(/@(\w+)(?:\([^)]*\))?/g));
  const annotations = Array.from(new Set(annotationMatches.map((m) => m[1])));

  // Method matching (heuristic regex for Java methods)
  const methodRegex = /(?:public|protected|private)\s+(?:static\s+)?([\w<>?,.\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  const methodMatches = Array.from(rawCode.matchAll(methodRegex));
  const methods = methodMatches.map((m) => ({
    name: m[2],
    returnType: m[1],
    parameters: m[3].trim(),
    isPublic: rawCode.includes(`public ${m[1]} ${m[2]}`),
  }));

  // Fields matching
  const fieldRegex = /(?:private|protected|public)\s+([\w<>?,.\[\]]+)\s+(\w+);/g;
  const fieldMatches = Array.from(rawCode.matchAll(fieldRegex));
  const fields = fieldMatches.map((m) => ({
    name: m[2],
    type: m[1],
    annotations: [],
  }));

  return {
    fileName,
    className,
    packageName,
    imports,
    annotations,
    methods,
    fields,
    rawCode,
    loc,
  };
};

export const parseJavaProject = (projectName: string, fileMap: Record<string, string>): ParsedJavaProject => {
  const files: ParsedJavaFile[] = [];
  let totalLoc = 0;
  const detectedClasses: string[] = [];
  const detectedControllers: string[] = [];
  const detectedServices: string[] = [];
  const detectedRepositories: string[] = [];

  for (const [fileName, code] of Object.entries(fileMap)) {
    if (!fileName.endsWith(".java") && !fileName.endsWith(".xml")) continue;

    if (fileName.endsWith(".java")) {
      const parsed = parseJavaCode(fileName, code);
      files.push(parsed);
      totalLoc += parsed.loc;
      detectedClasses.push(parsed.className);

      if (parsed.annotations.includes("RestController") || parsed.annotations.includes("Controller") || parsed.className.endsWith("Controller")) {
        detectedControllers.push(parsed.className);
      }
      if (parsed.annotations.includes("Service") || parsed.className.endsWith("Service")) {
        detectedServices.push(parsed.className);
      }
      if (parsed.annotations.includes("Repository") || parsed.className.endsWith("Repository")) {
        detectedRepositories.push(parsed.className);
      }
    }
  }

  return {
    projectName,
    files,
    totalLoc,
    detectedClasses,
    detectedControllers,
    detectedServices,
    detectedRepositories,
  };
};
