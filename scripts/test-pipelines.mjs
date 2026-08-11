import { randomBytes, scryptSync, randomUUID } from "node:crypto";

// ── In-Memory Database Store ─────────────────────────────────────────────────
const DB = {
  users: [],
  projects: [],
  coreAudits: [],
  impactAudits: [],
  blueprints: [],
  blueprintSteps: [],
  readinessAssessments: [],
  uploadedSources: [],
};

// Seed admin user
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

DB.users.push({
  id: "admin-user-id",
  username: "admin",
  email: "admin@alchemi.dev",
  passwordHash: hashPassword("admin"),
  role: "admin",
});

// ── Mock Prisma Client ───────────────────────────────────────────────────────
const mockPrisma = {
  user: {
    findFirst: async ({ where }) => {
      const { username, email, OR } = where;
      return DB.users.find(u => {
        if (username && u.username === username) return true;
        if (email && u.email === email) return true;
        if (OR) {
          return OR.some(cond => {
            return (cond.username && u.username === cond.username) || (cond.email && u.email === cond.email);
          });
        }
        return false;
      }) || null;
    },
    count: async () => DB.users.length,
    create: async ({ data }) => {
      const newUser = { id: `user-${randomUUID()}`, ...data };
      DB.users.push(newUser);
      return newUser;
    },
  },
  project: {
    create: async ({ data, include }) => {
      const projectId = `proj-${Date.now().toString(36)}`;
      const newProj = {
        id: projectId,
        name: data.name,
        repoUrl: data.repoUrl || "",
        stage: data.stage || "core_audit",
        readinessScore: data.readinessScore || 85,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      DB.projects.push(newProj);

      // Handle nested creates
      if (data.uploadedSources?.create) {
        for (const src of data.uploadedSources.create) {
          const source = { id: `src-${randomUUID()}`, projectId, ...src };
          DB.uploadedSources.push(source);
        }
      }

      if (data.blueprint?.create) {
        const blueprintId = `bp-${randomUUID()}`;
        const bp = { id: blueprintId, projectId, version: data.blueprint.create.version || 1 };
        DB.blueprints.push(bp);

        if (data.blueprint.create.steps?.create) {
          for (const s of data.blueprint.create.steps.create) {
            const step = {
              id: `step-${randomUUID()}`,
              blueprintId,
              stepNumber: s.stepNumber || 1,
              fileOrModule: s.fileOrModule,
              whatChanges: s.whatChanges,
              why: s.why,
              targetPattern: s.targetPattern,
              riskLevel: s.riskLevel || "medium",
              dependsOn: s.dependsOn || [],
              status: s.status || "pending",
            };
            DB.blueprintSteps.push(step);
          }
        }
      }

      // Return requested include shape
      return {
        ...newProj,
        uploadedSources: DB.uploadedSources.filter(s => s.projectId === projectId),
        blueprint: {
          ...DB.blueprints.find(b => b.projectId === projectId),
          steps: DB.blueprintSteps.filter(s => s.blueprintId === DB.blueprints.find(b => b.projectId === projectId)?.id),
        },
      };
    },
    findUnique: async ({ where, include }) => {
      const project = DB.projects.find(p => p.id === where.id);
      if (!project) return null;

      const res = { ...project };
      if (include?.uploadedSources) {
        res.uploadedSources = DB.uploadedSources.filter(s => s.projectId === project.id);
      }
      if (include?.coreAudit) {
        res.coreAudit = DB.coreAudits.find(a => a.projectId === project.id) || null;
      }
      if (include?.impactAudit) {
        res.impactAudit = DB.impactAudits.find(a => a.projectId === project.id) || null;
      }
      if (include?.blueprint) {
        const bp = DB.blueprints.find(b => b.projectId === project.id);
        res.blueprint = bp
          ? {
              ...bp,
              steps: DB.blueprintSteps.filter(s => s.blueprintId === bp.id),
            }
          : null;
      }
      return res;
    },
    update: async ({ where, data }) => {
      const p = DB.projects.find(proj => proj.id === where.id);
      if (p) {
        Object.assign(p, data);
        p.updatedAt = new Date();
      }
      return p;
    },
  },
  coreAudit: {
    upsert: async ({ where, update, create }) => {
      let audit = DB.coreAudits.find(a => a.projectId === where.projectId);
      if (audit) {
        Object.assign(audit, update);
      } else {
        audit = { id: `audit-${randomUUID()}`, ...create };
        DB.coreAudits.push(audit);
      }
      return audit;
    },
  },
  impactAudit: {
    upsert: async ({ where, update, create }) => {
      let audit = DB.impactAudits.find(a => a.projectId === where.projectId);
      if (audit) {
        Object.assign(audit, update);
      } else {
        audit = { id: `impact-${randomUUID()}`, ...create };
        DB.impactAudits.push(audit);
      }
      return audit;
    },
  },
  blueprintStep: {
    updateMany: async ({ where, data }) => {
      const steps = DB.blueprintSteps.filter(s => s.blueprintId === where.blueprintId);
      for (const s of steps) {
        Object.assign(s, data);
      }
      return { count: steps.length };
    },
  },
};

// Inject mock client globally BEFORE prisma.ts gets loaded
globalThis.prisma = mockPrisma;

// ── Mock Request / Response helper ───────────────────────────────────────────
class MockResponse {
  statusCode = 200;
  headers = {};
  body = null;

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(name, val) {
    this.headers[name] = val;
    return this;
  }

  json(obj) {
    this.body = obj;
    return this;
  }

  send(val) {
    this.body = val;
    return this;
  }

  end(val) {
    if (val) this.body = val;
    return this;
  }
}

// ── Sample Spring Boot Java Code ─────────────────────────────────────────────
const sampleJavaCode = `
package com.acme.store;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import javax.persistence.Entity;
import javax.persistence.Id;

@RestController
@Entity
public class OrderController {
    @Id
    private Long orderId;

    @GetMapping("/orders/status")
    public String getStatus(@RequestParam String id) {
        System.out.println("Checking order: " + id);
        return "ORDER_ACTIVE";
    }
}
`;

async function runTests() {
  console.log("🚀 Starting ALCHEMI Pipeline Test Suite...");

  // ── Import API handlers dynamically ───────────────────────────────────────
  const loginHandler = (await import("../api/auth/login.ts")).default;
  const coreHandler = (await import("../api/analyze/core.ts")).default;
  const impactHandler = (await import("../api/analyze/impact.ts")).default;
  const projectsHandler = (await import("../api/projects/index.ts")).default;
  const assessmentHandler = (await import("../api/projects/[id]/assessment.ts")).default;
  const reportHandler = (await import("../api/projects/[id]/report.ts")).default;

  // ── 1. Secure Authentication Tests ─────────────────────────────────────────
  console.log("\n🔑 Testing authentication security...");
  
  // Test 1a: Invalid credentials (should fail)
  const req1 = { method: "POST", body: { username: "hackerman", password: "123" } };
  const res1 = new MockResponse();
  await loginHandler(req1, res1);
  console.log(`  Invalid Login check: ${res1.statusCode === 401 ? "✅ Passed (Blocked)" : "❌ Failed"}`);

  // Test 1b: Valid hardcoded admin account
  const req2 = { method: "POST", body: { username: "admin", password: "admin" } };
  const res2 = new MockResponse();
  await loginHandler(req2, res2);
  console.log(`  Admin Login check:   ${res2.statusCode === 200 && res2.body.success ? "✅ Passed (Authenticated)" : "❌ Failed"}`);

  // ── 2. Create Project Pipeline ─────────────────────────────────────────────
  console.log("\n📁 Testing project creation pipeline...");
  const reqProj = {
    method: "POST",
    body: {
      name: "AcmeStore",
      repo_url: "github.com/acme/store-service",
      javaCode: sampleJavaCode
    }
  };
  const resProj = new MockResponse();
  await projectsHandler(reqProj, resProj);
  
  const createdProject = resProj.body;
  if (resProj.statusCode === 201 && createdProject?.id) {
    console.log(`  Create Project check: ✅ Passed (ID: ${createdProject.id})`);
  } else {
    console.log(`  Create Project check: ❌ Failed (Status: ${resProj.statusCode})`);
    return;
  }

  const projectId = createdProject.id;

  // ── 3. Core Architectural Audit ───────────────────────────────────────────
  console.log("\n🔬 Testing Core Architectural Audit...");
  const reqCore = {
    method: "POST",
    body: {
      project_id: projectId,
      code: sampleJavaCode
    }
  };
  const resCore = new MockResponse();
  await coreHandler(reqCore, resCore);
  
  const coreAudit = resCore.body;
  if (resCore.statusCode === 200 && coreAudit) {
    console.log("  Core Audit check:    ✅ Passed");
    console.log(`    - Summary:     ${coreAudit.architecture_summary}`);
    console.log(`    - Stack:       ${JSON.stringify(coreAudit.detected_stack)}`);
    console.log(`    - Deprecated:  ${JSON.stringify(coreAudit.deprecated_usages)}`);
  } else {
    console.log(`  Core Audit check:    ❌ Failed (Status: ${resCore.statusCode})`);
  }

  // ── 4. Impact & Blast Radius Audit ────────────────────────────────────────
  console.log("\n💥 Testing Impact Audit...");
  const reqImpact = {
    method: "POST",
    body: {
      project_id: projectId,
      code: sampleJavaCode
    }
  };
  const resImpact = new MockResponse();
  await impactHandler(reqImpact, resImpact);
  
  const impactAudit = resImpact.body;
  if (resImpact.statusCode === 200 && impactAudit) {
    console.log("  Impact Audit check:  ✅ Passed");
    console.log(`    - Database:    ${JSON.stringify(impactAudit.database_impacts)}`);
    console.log(`    - API Surface: ${JSON.stringify(impactAudit.api_surface)}`);
    console.log(`    - Blast:       ${JSON.stringify(impactAudit.blast_radius)}`);
  } else {
    console.log(`  Impact Audit check:  ❌ Failed (Status: ${resImpact.statusCode})`);
  }

  // ── 5. Readiness & Consensus Assessment ───────────────────────────────────
  console.log("\n📊 Testing Readiness and Consensus Assessment...");
  
  // Test 5a: Readiness calculation
  const reqReadiness = {
    method: "GET",
    query: { id: projectId, kind: "readiness" }
  };
  const resReadiness = new MockResponse();
  await assessmentHandler(reqReadiness, resReadiness);
  
  const readiness = resReadiness.body;
  if (resReadiness.statusCode === 200 && readiness) {
    console.log(`  Readiness check:     ✅ Passed (Overall Score: ${readiness.overall}%)`);
  } else {
    console.log(`  Readiness check:     ❌ Failed (Status: ${resReadiness.statusCode})`);
  }

  // Test 5b: Consensus calculation
  const reqConsensus = {
    method: "GET",
    query: { id: projectId, kind: "consensus" }
  };
  const resConsensus = new MockResponse();
  await assessmentHandler(reqConsensus, resConsensus);
  
  const consensus = resConsensus.body;
  if (resConsensus.statusCode === 200 && consensus) {
    console.log(`  Consensus check:     ✅ Passed (Conflicts: ${consensus.conflicts?.length || 0})`);
  } else {
    console.log(`  Consensus check:     ❌ Failed (Status: ${resConsensus.statusCode})`);
  }

  // ── 6. Migration Report ────────────────────────────────────────────────────
  console.log("\n📄 Testing Migration Report Generation...");
  const reqReport = {
    method: "GET",
    query: { id: projectId }
  };
  const resReport = new MockResponse();
  await reportHandler(reqReport, resReport);
  
  const report = resReport.body;
  if (resReport.statusCode === 200 && report) {
    console.log("  Report check:        ✅ Passed");
    console.log(`    - Diff files:  ${report.entries?.map(e => e.unit).join(", ")}`);
    console.log(`    - Rollback:    Exists (${report.rollback_plan ? "Yes" : "No"})`);
  } else {
    console.log(`  Report check:        ❌ Failed (Status: ${resReport.statusCode})`);
  }

  console.log("\n🏁 Pipeline Test Suite finished.");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
