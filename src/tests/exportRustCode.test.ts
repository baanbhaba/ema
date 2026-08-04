import { describe, it, expect } from "vitest";
import {
  stripRustComments,
  sanitizeRustCode,
} from "../utils/exportRustCode";

describe("Rust Code Sanitization & Formatting Engine", () => {
  it("strips single-line and multi-line Rust comments while preserving string literals containing slashes", () => {
    const rawRust = `use axum::{routing::get, Router}; // Top comment

/*
 Multi-line comment block
*/
#[tokio::main]
async fn main() {
    // Binding TCP listener
    let endpoint = "http://0.0.0.0:3000";
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap(); // trailing comment
}`;

    const stripped = stripRustComments(rawRust);
    expect(stripped).not.toContain("// Top comment");
    expect(stripped).not.toContain("Multi-line comment block");
    expect(stripped).not.toContain("// Binding TCP listener");
    expect(stripped).not.toContain("// trailing comment");
    expect(stripped).toContain('"http://0.0.0.0:3000"');
  });

  it("removes markdown fences, prose preambles, and non-existent macros", () => {
    const aiOutput = `Here is the migrated Rust code:

\`\`\`rust
use axum::{routing::get, Router};
import_axum_prelude!();

pub async fn health_check() -> &'static str {
    "OK"
}
\`\`\`
Hope this helps!`;

    const sanitized = sanitizeRustCode(aiOutput);
    expect(sanitized).not.toContain("Here is the migrated");
    expect(sanitized).not.toContain("```rust");
    expect(sanitized).not.toContain("import_axum_prelude!");
    expect(sanitized).not.toContain("Hope this helps!");
    expect(sanitized).toContain("pub async fn health_check()");
  });

  it("preserves semantic equivalence for CLI/Console programs without injecting HTTP Axum web servers", () => {
    const consoleOutput = `struct Bike;

fn main() {
    let _my_bike = Bike;
    println!("Bike object created!");
}`;

    const sanitized = sanitizeRustCode(consoleOutput);
    expect(sanitized).not.toContain("Router::new()");
    expect(sanitized).not.toContain("TcpListener::bind");
    expect(sanitized).toContain("struct Bike;");
    expect(sanitized).toContain('println!("Bike object created!");');
  });
});
