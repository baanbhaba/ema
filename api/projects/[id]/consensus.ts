import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../../src/lib/prisma";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing project id" });
  }

  if (req.method === "GET") {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          coreAudit: true,
          impactAudit: true,
          uploadedSources: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const coreAudit = project.coreAudit ? (typeof project.coreAudit === "string" ? JSON.parse(project.coreAudit) : project.coreAudit) : null;
      const impactAudit = project.impactAudit ? (typeof project.impactAudit === "string" ? JSON.parse(project.impactAudit) : project.impactAudit) : null;

      const primarySource = project.uploadedSources[0]?.fileName || `${project.name}.java`;
      const conflicts: any[] = [];

      const apiSurface = (impactAudit?.apiSurface as any[]) || (impactAudit?.api_surface as any[]) || [];
      const depUsages = (coreAudit?.deprecatedUsages as any[]) || (coreAudit?.deprecated_usages as any[]) || [];
      const depRisks = (impactAudit?.dependencyRisks as any[]) || (impactAudit?.dependency_risks as any[]) || [];
      const dbImpacts = (impactAudit?.databaseImpacts as any[]) || (impactAudit?.database_impacts as any[]) || [];

      // Conflict 1: AST conversion vs API Surface contract preservation
      const primaryApi = apiSurface[0]?.endpoint_or_interface || primarySource;
      const apiRisk = apiSurface[0]?.breaking_change_risk || "low";
      conflicts.push({
        topic: `Target Migration Pattern & API Contract for ${primaryApi}`,
        core_position: `Convert ${primarySource} structures and endpoints to native Rust Axum async handlers.`,
        impact_position: `Ensure zero breaking API contract changes for downstream consumers (${apiRisk.toUpperCase()} risk detected).`,
        resolved: apiRisk !== "high",
      });

      // Conflict 2: Deprecated Usages & Library Upgrades
      if (depUsages.length > 0 || depRisks.length > 0) {
        const mainPattern = depUsages[0]?.pattern || depRisks[0]?.library || "Legacy Dependencies";
        const replacement = depUsages[0]?.recommended_replacement || depRisks[0]?.target_version || "Updated Crates/Packages";
        conflicts.push({
          topic: `Modernization Strategy: ${mainPattern}`,
          core_position: `Refactor legacy calls from '${mainPattern}' to '${replacement}'.`,
          impact_position: `Verify backward compatibility and non-breaking upgrade paths across all dependents.`,
          resolved: depRisks.length === 0 || !depRisks.some((d: any) => d.known_breaking_changes?.length > 1),
        });
      }

      // Conflict 3: Database & State Persistence Layer
      if (dbImpacts.length > 0) {
        const dbComp = dbImpacts[0].component || "Database Layer";
        conflicts.push({
          topic: `Database Integration (${dbComp})`,
          core_position: `Migrate legacy ORM/JPA mappings to SQLx / async Rust database drivers.`,
          impact_position: `Assess migration risk for schema locks, transaction boundaries, and pool connections (${dbImpacts[0].risk} risk).`,
          resolved: dbImpacts[0].risk !== "high",
        });
      }

      const coreConf = (coreAudit?.confidence as number) ?? 0.92;
      const impactConf = (impactAudit?.confidence as number) ?? 0.90;
      const unified_confidence = Math.round(((coreConf + impactConf) / 2) * 100) / 100;
      const hasUnresolved = conflicts.some((c) => !c.resolved);

      const consensusResult = {
        iteration: hasUnresolved ? 2 : 1,
        conflicts,
        unified_confidence,
        should_iterate_again: hasUnresolved || unified_confidence < 0.85,
      };

      return res.status(200).json(consensusResult);
    } catch (error) {
      console.error(`GET /api/projects/${id}/consensus error:`, error);
      return res.status(500).json({ error: "Failed to fetch consensus result" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
