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
          blueprint: { include: { steps: true } },
          readinessAssessment: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const coreAudit = project.coreAudit ? (typeof project.coreAudit === "string" ? JSON.parse(project.coreAudit) : project.coreAudit) : null;
      const impactAudit = project.impactAudit ? (typeof project.impactAudit === "string" ? JSON.parse(project.impactAudit) : project.impactAudit) : null;

      const deprecatedUsages = (coreAudit?.deprecatedUsages as any[]) || (coreAudit?.deprecated_usages as any[]) || [];
      const detectedStack = (coreAudit?.detectedStack as any[]) || (coreAudit?.detected_stack as any[]) || [];
      const deprecatedCount = deprecatedUsages.length;
      const eolCount = detectedStack.filter((s: any) => s.status === "eol").length;
      const deprecatedStackCount = detectedStack.filter((s: any) => s.status === "deprecated").length;

      const apiSurface = (impactAudit?.apiSurface as any[]) || (impactAudit?.api_surface as any[]) || [];
      const highRiskApi = apiSurface.filter((a: any) => a.breaking_change_risk === "high").length;
      const medRiskApi = apiSurface.filter((a: any) => a.breaking_change_risk === "medium").length;

      const configImpacts = (impactAudit?.configImpacts as any[]) || (impactAudit?.config_impacts as any[]) || [];
      const highRiskConfig = configImpacts.filter((c: any) => c.risk === "high").length;
      const medRiskConfig = configImpacts.filter((c: any) => c.risk === "medium").length;

      const dependencyRisks = (impactAudit?.dependencyRisks as any[]) || (impactAudit?.dependency_risks as any[]) || [];

      const blastRadius = (impactAudit?.blastRadius as any[]) || (impactAudit?.blast_radius as any[]) || [];
      const highSeverityBlast = blastRadius.filter((b: any) => b.severity === "high").length;
      const medSeverityBlast = blastRadius.filter((b: any) => b.severity === "medium").length;

      const dbImpacts = (impactAudit?.databaseImpacts as any[]) || (impactAudit?.database_impacts as any[]) || [];
      const highDbRisk = dbImpacts.filter((d: any) => d.risk === "high").length;

      const steps = project.blueprint?.steps || [];
      const approvedSteps = steps.filter((s: any) => s.status === "approved").length;
      const rejectedSteps = steps.filter((s: any) => s.status === "rejected").length;

      const architecture_understanding = Math.max(50, Math.min(100, 96 - deprecatedCount * 4 - eolCount * 5 - deprecatedStackCount * 2));
      const dependency_resolution = Math.max(40, Math.min(100, 95 - dependencyRisks.length * 8 - eolCount * 6 - deprecatedStackCount * 3));
      const api_compatibility = Math.max(40, Math.min(100, 98 - highRiskApi * 15 - medRiskApi * 6));
      const configuration_completeness = Math.max(50, Math.min(100, 94 - highRiskConfig * 12 - medRiskConfig * 5));
      const migration_feasibility = Math.max(30, Math.min(100, 88 + approvedSteps * 4 - rejectedSteps * 10));
      const breaking_change_risk = Math.max(30, Math.min(100, 95 - highSeverityBlast * 15 - medSeverityBlast * 6));
      const rollback_availability = Math.max(50, Math.min(100, 96 - highDbRisk * 10));

      const overall = Math.round(
        architecture_understanding * 0.20 +
        migration_feasibility * 0.20 +
        dependency_resolution * 0.15 +
        api_compatibility * 0.15 +
        breaking_change_risk * 0.15 +
        configuration_completeness * 0.10 +
        rollback_availability * 0.05
      );

      const breakdown = {
        architecture_understanding,
        dependency_resolution,
        api_compatibility,
        configuration_completeness,
        migration_feasibility,
        breaking_change_risk,
        rollback_availability,
      };

      // Persist readiness score to project record
      await prisma.project.update({
        where: { id },
        data: { readinessScore: overall },
      }).catch(() => null);

      return res.status(200).json({ overall, breakdown });
    } catch (error) {
      console.error(`GET /api/projects/${id}/readiness error:`, error);
      return res.status(500).json({ error: "Failed to fetch readiness score" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
