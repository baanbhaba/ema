import type {
  ProjectSummary,
  CoreAudit,
  ImpactAudit,
  ConsensusResult,
  ReadinessScore,
  Blueprint,
  MigrationReport,
} from "../types/contracts";

export const MOCK_PROJECTS: ProjectSummary[] = [
  {
    id: "proj-payment-gateway",
    name: "Payment Gateway Service",
    repo_url: "github.com/acme/payment-gateway-service",
    stage: "awaiting_approval",
    readiness_score: 82,
    last_updated: "2026-08-03T18:30:00Z",
    java_from: "Java 8",
    java_to: "Java 21",
  },
  {
    id: "proj-auth-service",
    name: "Auth & Identity Provider",
    repo_url: "github.com/acme/auth-service",
    stage: "transforming",
    readiness_score: 94,
    last_updated: "2026-08-03T20:15:00Z",
    java_from: "Java 8",
    java_to: "Java 21",
  },
  {
    id: "proj-legacy-monolith",
    name: "Core Inventory Monolith",
    repo_url: "github.com/acme/inventory-monolith",
    stage: "analyzing",
    readiness_score: 48,
    last_updated: "2026-08-03T21:45:00Z",
    java_from: "Java 8",
    java_to: "Java 21",
  },
];

export const MOCK_CORE_AUDITS: Record<string, CoreAudit> = {
  "proj-payment-gateway": {
    architecture_summary:
      "Payment Gateway Service is a Spring Boot 2.4 / Java 8 microservice utilizing Spring Data JPA, Jakarta EE 8, and custom reflection-based memory buffers via sun.misc.Unsafe. Architecture relies heavily on synchronized blocks, thread-local contexts, and deprecated javax.* namespaces.",
    detected_stack: [
      { technology: "Java", version: "1.8.0_352", status: "eol" },
      { technology: "Spring Boot", version: "2.4.12", status: "eol" },
      { technology: "Hibernate ORM", version: "5.4.32.Final", status: "deprecated" },
      { technology: "Jackson Databind", version: "2.11.4", status: "deprecated" },
      { technology: "JUnit", version: "4.13.2", status: "deprecated" },
      { technology: "PostgreSQL Driver", version: "42.2.23", status: "current" },
    ],
    deprecated_usages: [
      {
        file: "src/main/java/com/acme/payment/buffer/DirectMemoryBuffer.java",
        line: 42,
        pattern: "sun.misc.Unsafe.allocateMemory",
        recommended_replacement: "java.lang.foreign.Arena & MemorySegment (FFM API)",
      },
      {
        file: "src/main/java/com/acme/payment/service/TransactionProcessor.java",
        line: 118,
        pattern: "Thread.stop() / Thread.suspend()",
        recommended_replacement: "Virtual Threads / StructuredTaskScope / ExecutorService",
      },
      {
        file: "src/main/java/com/acme/payment/util/DateUtils.java",
        line: 85,
        pattern: "java.util.Date / java.util.Calendar",
        recommended_replacement: "java.time.Instant / java.time.ZonedDateTime",
      },
      {
        file: "src/main/java/com/acme/payment/config/WebSecurityConfig.java",
        line: 64,
        pattern: "WebSecurityConfigurerAdapter",
        recommended_replacement: "SecurityFilterChain Bean Definition",
      },
      {
        file: "src/main/java/com/acme/payment/model/AuditLog.java",
        line: 23,
        pattern: "javax.persistence.*",
        recommended_replacement: "jakarta.persistence.*",
      },
    ],
    dependency_graph: {
      nodes: [
        "PaymentApplication",
        "TransactionProcessor",
        "DirectMemoryBuffer",
        "WebSecurityConfig",
        "PaymentRepository",
        "AuditLog",
      ],
      edges: [
        { from: "PaymentApplication", to: "TransactionProcessor" },
        { from: "PaymentApplication", to: "WebSecurityConfig" },
        { from: "TransactionProcessor", to: "DirectMemoryBuffer" },
        { from: "TransactionProcessor", to: "PaymentRepository" },
        { from: "PaymentRepository", to: "AuditLog" },
      ],
    },
    diagrams: [
      {
        type: "component",
        format: "mermaid",
        content: `graph TD
  Client[API Gateway / Client] -->|HTTPS POST /v1/charge| PaymentController
  PaymentController --> TransactionProcessor
  TransactionProcessor -->|Off-heap Buffering| DirectMemoryBuffer[Unsafe Memory Buffer]
  TransactionProcessor -->|JPA Persist| PaymentRepository
  PaymentRepository -->|PostgreSQL| Database[(PostgreSQL DB)]
  WebSecurityConfig -.->|Auth Interceptor| PaymentController`,
      },
      {
        type: "sequence",
        format: "mermaid",
        content: `sequenceDiagram
  autonumber
  actor Client
  participant Ctrl as PaymentController
  participant Proc as TransactionProcessor
  participant Buf as DirectMemoryBuffer
  participant Repo as PaymentRepository
  Client->>Ctrl: POST /v1/charge (Payload)
  Ctrl->>Proc: processTransaction(tx)
  Proc->>Buf: allocateAndWrite(txData)
  Buf-->>Proc: MemorySegment / Handle
  Proc->>Repo: save(PaymentRecord)
  Repo-->>Ctrl: Saved Record
  Ctrl-->>Client: 200 OK (TransactionID)`,
      },
    ],
    confidence: 0.92,
  },
  "proj-auth-service": {
    architecture_summary:
      "Auth & Identity Provider handles JWT token generation, OAuth2 authorization code flows, and LDAP integrations. Currently running on Java 11 with early Spring Boot 2.7.",
    detected_stack: [
      { technology: "Java", version: "11.0.18", status: "deprecated" },
      { technology: "Spring Boot", version: "2.7.8", status: "deprecated" },
      { technology: "nimbus-jose-jwt", version: "9.22", status: "current" },
      { technology: "JUnit", version: "5.8.2", status: "current" },
    ],
    deprecated_usages: [
      {
        file: "src/main/java/com/acme/auth/jwt/TokenProvider.java",
        line: 55,
        pattern: "javax.crypto.* namespace imports",
        recommended_replacement: "jakarta.crypto / java.security standard APIs",
      },
    ],
    dependency_graph: {
      nodes: ["AuthApplication", "TokenProvider", "LdapConnector"],
      edges: [
        { from: "AuthApplication", to: "TokenProvider" },
        { from: "AuthApplication", to: "LdapConnector" },
      ],
    },
    diagrams: [
      {
        type: "component",
        format: "mermaid",
        content: `graph LR
  Client --> AuthApplication
  AuthApplication --> TokenProvider
  AuthApplication --> LdapConnector`,
      },
    ],
    confidence: 0.97,
  },
  "proj-legacy-monolith": {
    architecture_summary:
      "Large inventory monolith built in 2012 targeting Java 8 and Spring 3.2. Uses custom bytecode manipulation, unmaintained ORM wrappers, and obsolete Log4j 1.x logging framework.",
    detected_stack: [
      { technology: "Java", version: "1.8.0_121", status: "eol" },
      { technology: "Spring Framework", version: "3.2.18.RELEASE", status: "eol" },
      { technology: "Log4j", version: "1.2.17", status: "eol" },
      { technology: "CGLIB", version: "2.2.2", status: "eol" },
    ],
    deprecated_usages: [
      {
        file: "src/main/java/com/acme/inventory/util/CustomBytecode.java",
        line: 12,
        pattern: "sun.misc.Cleaner / sun.misc.Unsafe",
        recommended_replacement: "java.lang.ref.Cleaner",
      },
    ],
    dependency_graph: {
      nodes: ["InventoryApp", "LegacyDAO", "Log4jManager"],
      edges: [
        { from: "InventoryApp", to: "LegacyDAO" },
        { from: "InventoryApp", to: "Log4jManager" },
      ],
    },
    diagrams: [
      {
        type: "component",
        format: "mermaid",
        content: `graph TD
  InventoryApp --> LegacyDAO
  InventoryApp --> Log4jManager`,
      },
    ],
    confidence: 0.65,
  },
};

export const MOCK_IMPACT_AUDITS: Record<string, ImpactAudit> = {
  "proj-payment-gateway": {
    api_surface: [
      {
        endpoint_or_interface: "POST /v1/charge",
        consumers: ["mobile-app-v2", "checkout-frontend", "recurring-billing-worker"],
        breaking_change_risk: "high",
      },
      {
        endpoint_or_interface: "GET /v1/refund/{id}",
        consumers: ["admin-portal", "support-service"],
        breaking_change_risk: "low",
      },
      {
        endpoint_or_interface: "com.acme.payment.api.PaymentCallbackHandler",
        consumers: ["stripe-webhook-consumer", "paypal-webhook-consumer"],
        breaking_change_risk: "medium",
      },
    ],
    database_impacts: [
      {
        component: "Hibernate ORM / Dialect",
        risk: "high",
        notes:
          "Upgrading to Hibernate 6.4 requires migrating from `org.hibernate.dialect.PostgreSQL95Dialect` to `PostgreSQLDialect`. Custom sequence generators require `@SequenceGenerator` annotation schema migration.",
      },
      {
        file: "src/main/resources/db/migration/V4__payment_tokens.sql",
        risk: "medium",
        notes: "TIMESTAMP WITH TIME ZONE formatting change between Java 8 Instant and Java 21 Instant in JDBC driver v42.7.",
      },
    ],
    config_impacts: [
      {
        component: "Spring Boot 3.2 Security Configuration",
        risk: "high",
        notes:
          "WebSecurityConfigurerAdapter is removed in Spring Security 6. Must migrate to explicit `SecurityFilterChain` bean definition and `AuthorizeHttpRequests` DSL.",
      },
      {
        file: "src/main/resources/application.yml",
        risk: "medium",
        notes: "Deprecation of `server.servlet.context-path` format in favor of Spring Boot 3 standard properties.",
      },
    ],
    dependency_risks: [
      {
        library: "org.springframework.boot:spring-boot-starter-web",
        current_version: "2.4.12",
        target_version: "3.2.2",
        known_breaking_changes: [
          "Package relocation from javax.servlet to jakarta.servlet",
          "Removal of Spring MVC MatrixVariables legacy syntax",
          "Stricter URL matching trailing slash behavior",
        ],
      },
      {
        library: "org.hibernate:hibernate-core",
        current_version: "5.4.32.Final",
        target_version: "6.4.1.Final",
        known_breaking_changes: [
          "Package relocation from javax.persistence to jakarta.persistence",
          "Criteria API query type enforcement",
          "Native query parameter binding zero-indexing change",
        ],
      },
      {
        library: "com.fasterxml.jackson.core:jackson-databind",
        current_version: "2.11.4",
        target_version: "2.16.1",
        known_breaking_changes: [
          "Default typing restrictions for polymorphic deserialization",
          "Strict Java 8 date/time module registration requirement",
        ],
      },
    ],
    blast_radius: [
      {
        change: "Migration from javax.* to jakarta.* namespaces across application",
        affected_files: [
          "src/main/java/com/acme/payment/model/PaymentRecord.java",
          "src/main/java/com/acme/payment/model/AuditLog.java",
          "src/main/java/com/acme/payment/model/CustomerAccount.java",
          "src/main/java/com/acme/payment/controller/PaymentController.java",
          "src/main/java/com/acme/payment/controller/RefundController.java",
          "src/main/java/com/acme/payment/filter/AuthHeaderFilter.java",
          "src/main/java/com/acme/payment/filter/LoggingFilter.java",
          "src/main/java/com/acme/payment/config/WebSecurityConfig.java",
        ],
        severity: "high",
      },
      {
        change: "Replacement of sun.misc.Unsafe direct memory allocation with Java 21 Foreign Function & Memory (FFM) API",
        affected_files: [
          "src/main/java/com/acme/payment/buffer/DirectMemoryBuffer.java",
          "src/main/java/com/acme/payment/buffer/NativeMemoryPool.java",
          "src/main/java/com/acme/payment/service/TransactionProcessor.java",
        ],
        severity: "high",
      },
      {
        change: "Migration of JUnit 4 annotations (@Test, @Before, Assert) to JUnit 5 Jupiter",
        affected_files: [
          "src/test/java/com/acme/payment/service/TransactionProcessorTest.java",
          "src/test/java/com/acme/payment/controller/PaymentControllerTest.java",
          "src/test/java/com/acme/payment/buffer/DirectMemoryBufferTest.java",
        ],
        severity: "medium",
      },
    ],
    confidence: 0.89,
  },
  "proj-auth-service": {
    api_surface: [
      {
        endpoint_or_interface: "POST /oauth/token",
        consumers: ["all-gateway-clients"],
        breaking_change_risk: "low",
      },
    ],
    database_impacts: [],
    config_impacts: [],
    dependency_risks: [
      {
        library: "org.springframework.boot:spring-boot-starter-security",
        current_version: "2.7.8",
        target_version: "3.2.2",
        known_breaking_changes: ["jakarta.servlet import update"],
      },
    ],
    blast_radius: [
      {
        change: "javax to jakarta package rename",
        affected_files: ["src/main/java/com/acme/auth/controller/AuthController.java"],
        severity: "low",
      },
    ],
    confidence: 0.96,
  },
  "proj-legacy-monolith": {
    api_surface: [
      {
        endpoint_or_interface: "SOAP /InventoryService.wsdl",
        consumers: ["legacy-erp", "warehouse-scanner"],
        breaking_change_risk: "high",
      },
    ],
    database_impacts: [
      {
        component: "Oracle 11g JDBC Driver",
        risk: "high",
        notes: "ojdbc6 incompatible with Java 21 runtime. Requires upgrading to ojdbc11.",
      },
    ],
    config_impacts: [
      {
        component: "XML Application Context",
        risk: "high",
        notes: "Spring 3.2 XML schemas fail under Spring 6 validation parsers.",
      },
    ],
    dependency_risks: [
      {
        library: "log4j:log4j",
        current_version: "1.2.17",
        target_version: "org.apache.logging.log4j:log4j-core:2.22.1",
        known_breaking_changes: [
          "Complete API rewrite from PropertyConfigurator to LoggerContext",
          "Log4j 1.x bridge removal",
        ],
      },
    ],
    blast_radius: [
      {
        change: "Full framework overhaul from Spring 3.2 XML to Spring Boot 3 Java Config",
        affected_files: [
          "src/main/resources/applicationContext.xml",
          "src/main/resources/log4j.properties",
          "src/main/java/com/acme/inventory/dao/LegacyDAO.java",
          "src/main/java/com/acme/inventory/util/CustomBytecode.java",
        ],
        severity: "high",
      },
    ],
    confidence: 0.55,
  },
};

export const MOCK_CONSENSUS: Record<string, ConsensusResult> = {
  "proj-payment-gateway": {
    iteration: 2,
    conflicts: [
      {
        topic: "sun.misc.Unsafe Memory Allocation Replacement",
        core_position:
          "Core Audit recommends replacing sun.misc.Unsafe with java.lang.foreign.Arena and MemorySegment (Java 21 FFM API) for zero-copy performance parity.",
        impact_position:
          "Impact Audit warns that Java 21 FFM API requires `--enable-native-access` JVM argument in production Docker entrypoint and affects NativeMemoryPool.java.",
        resolved: true,
      },
      {
        topic: "Spring Security WebSecurityConfigurerAdapter Migration",
        core_position:
          "Core Audit flagged standard code transform to SecurityFilterChain bean syntax.",
        impact_position:
          "Impact Audit identified custom CORS policy helper in AuthHeaderFilter.java that breaks under Spring Security 6 strict authorization rules.",
        resolved: true,
      },
      {
        topic: "Database Driver & Dialect Version Alignment",
        core_position:
          "Core Audit assumed standard Hibernate 6 auto-detection for PostgreSQL dialect.",
        impact_position:
          "Impact Audit flagged custom spatial geometry types requiring explicit Hibernate Spatial 6 dependency declaration.",
        resolved: false,
      },
    ],
    unified_confidence: 0.88,
    should_iterate_again: false,
  },
  "proj-auth-service": {
    iteration: 1,
    conflicts: [],
    unified_confidence: 0.97,
    should_iterate_again: false,
  },
  "proj-legacy-monolith": {
    iteration: 1,
    conflicts: [
      {
        topic: "Bytecode Proxy & Target Memory Management",
        core_position: "Proposes replacement with ByteBuddy for dynamic proxy creation.",
        impact_position: "Identified zero breaking encapsulation checks for target execution.",
        resolved: true,
      },
      {
        topic: "Logging System Modernization",
        core_position: "Suggests log4j-to-slf4j bridge inclusion.",
        impact_position: "Bridge verified and output streams configured for structured stdout.",
        resolved: true,
      },
    ],
    unified_confidence: 0.94,
    should_iterate_again: false,
  },
};

export const MOCK_READINESS_SCORES: Record<string, ReadinessScore> = {
  "proj-payment-gateway": {
    overall: 82,
    breakdown: {
      architecture_understanding: 90, // 20%
      dependency_resolution: 85,      // 15%
      api_compatibility: 80,          // 15%
      configuration_completeness: 75, // 10%
      migration_feasibility: 85,      // 20%
      breaking_change_risk: 70,       // 15%
      rollback_availability: 95,      // 5%
    },
  },
  "proj-auth-service": {
    overall: 94,
    breakdown: {
      architecture_understanding: 98,
      dependency_resolution: 95,
      api_compatibility: 96,
      configuration_completeness: 92,
      migration_feasibility: 95,
      breaking_change_risk: 90,
      rollback_availability: 98,
    },
  },
  "proj-legacy-monolith": {
    overall: 90,
    breakdown: {
      architecture_understanding: 92,
      dependency_resolution: 88,
      api_compatibility: 90,
      configuration_completeness: 88,
      migration_feasibility: 92,
      breaking_change_risk: 88,
      rollback_availability: 95,
    },
  },
};

export const MOCK_BLUEPRINTS: Record<string, Blueprint> = {
  "proj-payment-gateway": {
    project_id: "proj-payment-gateway",
    steps: [
      {
        id: "step-1",
        file_or_module: "pom.xml / build.gradle",
        what_changes: "Upgrade Java target version to 21, Spring Boot to 3.2.2, Hibernate to 6.4.1.Final, and replace javax namespace dependencies with jakarta.",
        why: "Core prerequisite to establish Java 21 bytecode compatibility and Jakarta EE 10 standards.",
        target_pattern: `<java.version>21</java.version>\n<spring-boot.version>3.2.2</spring-boot.version>`,
        risk_level: "high",
        depends_on: [],
        status: "approved",
      },
      {
        id: "step-2",
        file_or_module: "src/main/java/com/acme/payment/model/AuditLog.java",
        what_changes: "Replace javax.persistence.* annotations (@Entity, @Table, @Id) with jakarta.persistence.* equivalents.",
        why: "Spring Boot 3 / Hibernate 6 requires Jakarta EE 10 JPA annotations.",
        target_pattern: `import jakarta.persistence.Entity;\nimport jakarta.persistence.Table;\nimport jakarta.persistence.Id;`,
        risk_level: "low",
        depends_on: ["step-1"],
        status: "approved",
      },
      {
        id: "step-3",
        file_or_module: "src/main/java/com/acme/payment/buffer/DirectMemoryBuffer.java",
        what_changes: "Migrate sun.misc.Unsafe off-heap memory allocation to Java 21 Foreign Function & Memory (FFM) API (Arena.ofConfined() & MemorySegment).",
        why: "sun.misc.Unsafe memory allocation APIs are deprecated for removal in Java 21 and trigger runtime warnings.",
        target_pattern: `try (Arena arena = Arena.ofConfined()) {\n  MemorySegment segment = arena.allocate(bufferSize);\n  // zero-copy memory write\n}`,
        risk_level: "high",
        depends_on: ["step-1"],
        status: "pending",
      },
      {
        id: "step-4",
        file_or_module: "src/main/java/com/acme/payment/config/WebSecurityConfig.java",
        what_changes: "Refactor WebSecurityConfigurerAdapter into SecurityFilterChain bean definition.",
        why: "WebSecurityConfigurerAdapter was removed in Spring Security 6.",
        target_pattern: `@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n  http.authorizeHttpRequests(auth -> auth.anyRequest().authenticated());\n  return http.build();\n}`,
        risk_level: "medium",
        depends_on: ["step-1"],
        status: "pending",
      },
      {
        id: "step-5",
        file_or_module: "src/main/java/com/acme/payment/service/TransactionProcessor.java",
        what_changes: "Replace synchronized worker threads with Java 21 Virtual Threads (Executors.newVirtualThreadPerTaskExecutor()).",
        why: "Improves throughput for concurrent transaction processing without thread starvation.",
        target_pattern: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n  executor.submit(() -> process(tx));\n}`,
        risk_level: "medium",
        depends_on: ["step-3", "step-4"],
        status: "pending",
      },
      {
        id: "step-6",
        file_or_module: "src/test/java/com/acme/payment/service/TransactionProcessorTest.java",
        what_changes: "Migrate JUnit 4 runner and assertions to JUnit 5 Jupiter engine.",
        why: "JUnit 4 runner does not support Spring Boot 3 test contexts.",
        target_pattern: `import org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;`,
        risk_level: "low",
        depends_on: ["step-5"],
        status: "pending",
      },
    ],
  },
  "proj-auth-service": {
    project_id: "proj-auth-service",
    steps: [
      {
        id: "step-1",
        file_or_module: "pom.xml",
        what_changes: "Upgrade Java 11 to Java 21 and Spring Boot 2.7 to 3.2.2.",
        why: "Baseline migration.",
        target_pattern: `<java.version>21</java.version>`,
        risk_level: "low",
        depends_on: [],
        status: "approved",
      },
    ],
  },
  "proj-legacy-monolith": {
    project_id: "proj-legacy-monolith",
    steps: [
      {
        id: "step-1",
        file_or_module: "pom.xml",
        what_changes: "Major pom rebuild.",
        why: "Required for baseline compile.",
        target_pattern: `<java.version>21</java.version>`,
        risk_level: "high",
        depends_on: [],
        status: "pending",
      },
    ],
  },
};

export const MOCK_REPORTS: Record<string, MigrationReport> = {
  "proj-payment-gateway": {
    project_id: "proj-payment-gateway",
    core_audit: MOCK_CORE_AUDITS["proj-payment-gateway"],
    impact_audit: MOCK_IMPACT_AUDITS["proj-payment-gateway"],
    blueprint: MOCK_BLUEPRINTS["proj-payment-gateway"],
    entries: [
      {
        unit: "src/main/java/com/acme/payment/model/AuditLog.java",
        diff: `--- a/src/main/java/com/acme/payment/model/AuditLog.java
+++ b/src/main/java/com/acme/payment/model/AuditLog.java
@@ -1,9 +1,9 @@
 package com.acme.payment.model;
 
-import javax.persistence.Entity;
-import javax.persistence.Id;
-import javax.persistence.Table;
+import jakarta.persistence.Entity;
+import jakarta.persistence.Id;
+import jakarta.persistence.Table;
 import java.time.Instant;
 
 @Entity
 @Table(name = "audit_logs")
 public class AuditLog {`,
        validation: {
          unit: "AuditLog.java",
          build_status: "pass",
          tests_run: 14,
          tests_passed: 14,
          lint_issues: [],
          coverage_note: "100% line coverage verified in automated suite.",
        },
        approved_by: "alex.dev@acme.com (Lead Principal Engineer)",
        approved_at: "2026-08-03T18:25:00Z",
      },
      {
        unit: "src/main/java/com/acme/payment/buffer/DirectMemoryBuffer.java",
        diff: `--- a/src/main/java/com/acme/payment/buffer/DirectMemoryBuffer.java
+++ b/src/main/java/com/acme/payment/buffer/DirectMemoryBuffer.java
@@ -1,15 +1,14 @@
 package com.acme.payment.buffer;
 
-import sun.misc.Unsafe;
-import java.lang.reflect.Field;
+import java.lang.foreign.Arena;
+import java.lang.foreign.MemorySegment;
 
 public class DirectMemoryBuffer {
-    private static final Unsafe unsafe;
+    private final Arena arena = Arena.ofConfined();
     
-    public byte[] readBuffer(long address, int length) {
-        byte[] dest = new byte[length];
-        unsafe.copyMemory(null, address, dest, Unsafe.ARRAY_BYTE_BASE_OFFSET, length);
-        return dest;
+    public MemorySegment allocateBuffer(long capacity) {
+        return arena.allocate(capacity);
     }
 }`,
        validation: {
          unit: "DirectMemoryBuffer.java",
          build_status: "pass",
          tests_run: 0,
          tests_passed: 0,
          lint_issues: [
            "Warning: Native FFM API access requires --enable-native-access JVM flag at launch.",
          ],
          coverage_note: "no test coverage, migrated but unverified",
        },
        approved_by: "alex.dev@acme.com (Lead Principal Engineer)",
        approved_at: "2026-08-03T18:29:12Z",
      },
    ],
    rollback_plan: `# EMA Automated Rollback Procedure for Project Payment Gateway
# Created automatically on 2026-08-03T18:30:00Z

## Step 1: Revert Git Commits
git checkout main
git revert --no-edit HEAD~2..HEAD

## Step 2: Restore Legacy Maven/Gradle Wrapper Settings
./mvnw wrapper:wrapper -Dmaven=3.8.6
./mvnw clean install -DskipTests=false

## Step 3: Database Migration Downgrade (Flyway / Liquibase)
./mvnw flyway:undo -Dflyway.target=3

## Step 4: Environment JVM Flags Verification
unset JDK_JAVA_OPTIONS
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
java -version # Expected: java version "1.8.0_352"`,
  },
};
