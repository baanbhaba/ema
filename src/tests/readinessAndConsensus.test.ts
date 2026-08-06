import { describe, it, expect } from "vitest";
import { calculateDynamicReadinessScore, calculateDynamicConsensus } from "../api/project";
import { getMigrationReport } from "../api/report";
import type { CoreAudit, ImpactAudit, Blueprint } from "../types/contracts";

describe("Dynamic Readiness & Consensus Engine", () => {
  const mockCoreAudit: CoreAudit = {
    architecture_summary: "Core audit summary for custom Java project",
    detected_stack: [
      { technology: "Java", version: "8.0", status: "eol" },
      { technology: "Spring Boot", version: "2.4", status: "deprecated" },
    ],
    deprecated_usages: [
      { file: "CustomController.java", line: 12, pattern: "javax.servlet.*", recommended_replacement: "jakarta.servlet.*" },
    ],
    dependency_graph: { nodes: ["CustomController"], edges: [] },
    diagrams: [],
    confidence: 0.94,
  };

  const mockImpactAudit: ImpactAudit = {
    api_surface: [
      { endpoint_or_interface: "CustomController.java", consumers: ["Web Client"], breaking_change_risk: "high" },
    ],
    database_impacts: [
      { component: "Hibernate Dialect", risk: "high", notes: "Requires schema locking migration" },
    ],
    config_impacts: [
      { file: "application.yml", risk: "medium", notes: "Spring Boot 3 property mapping" },
    ],
    dependency_risks: [
      { library: "Spring Security", current_version: "5.4", target_version: "6.2", known_breaking_changes: ["authorizeRequests deprecated", "WebSecurityConfigurerAdapter removed"] },
    ],
    blast_radius: [
      { change: "Java 21 Modernization", affected_files: ["CustomController.java"], severity: "high" },
    ],
    confidence: 0.90,
  };

  const mockBlueprint: Blueprint = {
    project_id: "proj-custom-test",
    steps: [
      {
        id: "step-1",
        file_or_module: "CustomController.java",
        what_changes: "Migrate REST Controller",
        why: "Modernization",
        target_pattern: "pub struct CustomControllerHandler {}",
        risk_level: "high",
        depends_on: [],
        status: "approved",
      },
    ],
  };

  it("calculates dynamic readiness score reflecting actual project audit findings", () => {
    const readiness = calculateDynamicReadinessScore(mockCoreAudit, mockImpactAudit, mockBlueprint);

    expect(readiness.overall).toBeGreaterThan(0);
    expect(readiness.overall).toBeLessThanOrEqual(100);
    expect(readiness.breakdown).toHaveProperty("architecture_understanding");
    expect(readiness.breakdown).toHaveProperty("dependency_resolution");
    expect(readiness.breakdown).toHaveProperty("api_compatibility");
    expect(readiness.breakdown).toHaveProperty("configuration_completeness");
    expect(readiness.breakdown).toHaveProperty("migration_feasibility");
    expect(readiness.breakdown).toHaveProperty("breaking_change_risk");
    expect(readiness.breakdown).toHaveProperty("rollback_availability");
  });

  it("generates dynamic consensus result with project-specific conflicts", () => {
    const consensus = calculateDynamicConsensus(mockCoreAudit, mockImpactAudit, "CustomController.java");

    expect(consensus.conflicts.length).toBeGreaterThan(0);
    expect(consensus.conflicts[0].topic).toContain("CustomController.java");
    expect(consensus.conflicts[0].core_position).toContain("CustomController.java");
    expect(consensus.unified_confidence).toBe(0.92);
  });

  it("generates migration report with synced diffs and dynamic rollback plan", async () => {
    const report = await getMigrationReport("proj-custom-test");

    expect(report.project_id).toBe("proj-custom-test");
    expect(report.entries.length).toBeGreaterThan(0);
    expect(report.rollback_plan).toContain("proj-custom-test");
    expect(report.rollback_plan).toContain("Rollback Plan");
  });
});
