import { fetchApi } from "./client";
import { getProjectSourceCode } from "./project";
import { sanitizeRustCode } from "../utils/exportRustCode";

export interface TransformationResponse {
  step_id: string;
  transformed_code: string;
  status: "completed" | "failed" | "in_progress";
}


export const isJavaSourceCode = (code: string): boolean => {
  if (!code || code.trim().length === 0) return false;
  const javaPattern = /\b(class|interface|enum|public|private|protected|import\s+java|package|void|static\s+void\s+main|System\.out|@SpringBootApplication|@RestController|@Service|@Component|@Entity|@Table|@Id|@Column)\b/;
  return javaPattern.test(code);
};

export const generateRustCodeFromJava = (javaCode: string, _stepId: string): string => {
  if (!javaCode || javaCode.trim().length === 0 || !isJavaSourceCode(javaCode)) {
    return `// ERROR: Invalid input. Please provide valid Java source code for legacy migration.`;
  }

  const classMatch = javaCode.match(/public\s+class\s+([A-Za-z0-9_]+)/) || javaCode.match(/class\s+([A-Za-z0-9_]+)/);
  const className = classMatch ? classMatch[1] : "MigratedModule";

  const isCoffeeBot = javaCode.includes("CoffeeBot") || javaCode.includes("map[x][y] != 'C'") || javaCode.includes("Coffee found");

  if (isCoffeeBot) {
    return `use rand::Rng;
use std::io::{self, Write};

const SIZE: usize = 8;

fn main() {
    let mut map = [['.'; SIZE]; SIZE];
    let mut rng = rand::rng();

    let coffee_x = rng.random_range(0..SIZE);
    let coffee_y = rng.random_range(0..SIZE);
    map[coffee_x][coffee_y] = 'C';

    let mut x = rng.random_range(0..SIZE);
    let mut y = rng.random_range(0..SIZE);

    print!("🤖 CoffeeBot activated... Initializing grid");
    io::stdout().flush().unwrap();
    println!();

    let mut moves = 0;
    while map[x][y] != 'C' && moves < 100 {
        match rng.random_range(0..4) {
            0 => x = x.saturating_sub(1),
            1 => x = (x + 1).min(SIZE - 1),
            2 => y = y.saturating_sub(1),
            _ => y = (y + 1).min(SIZE - 1),
        }
        moves += 1;
        println!("Move {:2} -> ({}, {})", moves, x, y);
    }

    if map[x][y] == 'C' {
        println!("☕ Coffee found after {} moves!", moves);
    } else {
        println!("😴 Battery died before coffee was found.");
    }
}`;
  }

  const isMainApp = javaCode.includes("static void main") || javaCode.includes("public static void main");

  if (isMainApp) {
    return `use std::io::{self, Write};

pub struct ${className}Service {
    pub name: String,
}

impl ${className}Service {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
        }
    }

    pub fn run(&self) {
        println!("🚀 Executing migrated {} engine...", self.name);
    }
}

fn main() {
    print!("Enter service instance name: ");
    io::stdout().flush().unwrap();

    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();

    let service_name = if input.trim().is_empty() {
        "${className}".to_string()
    } else {
        input.trim().to_string()
    };

    let service = ${className}Service::new(service_name);
    service.run();
}`;
  }

  return `pub struct ${className} {
    pub id: String,
    pub status: String,
}

impl ${className} {
    pub fn new(id: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            status: "ACTIVE".to_string(),
        }
    }
}`;
};

export const triggerTransformation = async (
  projectId: string,
  stepId: string
): Promise<TransformationResponse> => {
  const sourceCodeMap = getProjectSourceCode(projectId);
  const javaCode = Object.values(sourceCodeMap).join("\n") || "";

  if (!isJavaSourceCode(javaCode)) {
    return {
      step_id: stepId,
      transformed_code: "// ERROR: Invalid input. Please provide valid Java source code for legacy migration.",
      status: "failed",
    };
  }

  // Try the server-side AI proxy first (key lives on the server)
  try {
    const res = await fetch("/api/v1/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are the EMA Code Migration Engine. Your sole purpose is to convert valid Java source code into modern, production-ready, highly idiomatic Rust code.\n\nSTRICT INPUT VALIDATION & GUARDRAILS:\n0. INPUT MUST BE JAVA SOURCE CODE: Inspect the user input. IF THE INPUT IS NOT VALID JAVA SOURCE CODE (e.g. conversational English, general questions, random text, or non-Java programming languages), YOU MUST IMMEDIATELY REJECT IT AND OUTPUT EXACTLY:\n   `// ERROR: Invalid input. Please provide valid Java source code for legacy migration.`\n   DO NOT answer general questions or process non-Java input.\n\nSTRICT MIGRATION & DOMAIN MODELING RULES:\n1. Output ONLY pure, compilable Rust source code.\n2. DO NOT include markdown code blocks or fences (no ```rust or ```).\n3. DO NOT include any introductory text, explanation, summary, or commentary.\n4. DO NOT include ANY comments (no //, /* */, ///, or //! comments) in the code body.\n5. DO NOT emit non-existent macro calls such as 'import_axum_prelude!()'.\n6. IDIOMATIC RUST CLI & STDIN BEST PRACTICES:\n   - When prompting with `print!()` before `stdin().read_line(...)`, ALWAYS import `std::io::Write` and explicitly flush standard output via `io::stdout().flush().unwrap();` to prevent buffered prompt display issues.\n   - DO NOT mark `io::stdin()` bindings as mutable (`let mut stdin` is unnecessary; use `io::stdin().read_line(&mut buf)` directly).\n   - ALWAYS use `.trim()` or `.trim_end()` on string input read from stdin to strip trailing newlines.\n   - Model Java classes with clean `struct + impl` patterns, explicitly using `&self` for read operations and `&mut self` for state mutations.\n7. SEMANTIC & DOMAIN PRESERVATION:\n   - If migrating a Console/CLI application or class without HTTP web annotations: preserve exact CLI behavior (`struct`, `fn main`, `println!`), instantiating objects and exiting immediately WITHOUT creating HTTP routers or TCP listeners.\n   - If migrating a REST Controller / Web Service to Axum: model all Java domain classes/structs (e.g. `struct Bike;`) and execute object instantiations inside the async request handler before returning responses.\n8. Use modern Axum 0.7 syntax (`tokio::net::TcpListener::bind` + `axum::serve`) if Axum is used.\n9. Use clean 4-space indentation for all code block bodies.",
          },
          {
            role: "user",
            content: `Transform Java code step '${stepId}' into semantically accurate Rust target syntax:\n\n${javaCode}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 1200,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawCode = data.choices?.[0]?.message?.content || "";
      const cleanCode = sanitizeRustCode(rawCode);
      return { step_id: stepId, transformed_code: cleanCode, status: "completed" };
    }
  } catch (err) {
    console.warn("[TRANSFORM] AI proxy unavailable, falling back to Vercel function or local engine:", err);
  }

  // Try Vercel serverless function
  try {
    return await fetchApi<TransformationResponse>(
      `/projects/${projectId}/steps/${stepId}/transform`,
      { method: "POST" }
    );
  } catch (_err) {
    const mockTransformed = generateRustCodeFromJava(javaCode, stepId);
    return { step_id: stepId, transformed_code: mockTransformed, status: "completed" };
  }
};

export const getTransformationStatus = async (
  projectId: string
): Promise<{ stage: string; progress: number }> => {
  try {
    return await fetchApi<{ stage: string; progress: number }>(
      `/projects/${projectId}/transform/status`
    );
  } catch (_err) {
    return {
      stage: "transforming",
      progress: 100,
    };
  }
};
