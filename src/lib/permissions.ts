/**
 * ALCHEMI — Role-Based Access Control (RBAC) System
 *
 * Defines user roles, their permissions, and account-level isolation rules.
 *
 * Roles (in descending privilege order):
 *   SUPER_DEV      — Internal developer (baanbhaba). Full access + live AI engine.
 *   ADMIN          — Organisation administrator. Full read/write, no live AI engine.
 *   LEAD_ARCHITECT — Can approve/reject all blueprint steps and view all reports.
 *   REVIEWER       — Can approve/reject blueprint steps assigned to them.
 *   DEVELOPER      — Can upload code, trigger transforms, view their own projects.
 *   VIEWER         — Read-only access to projects they are assigned to.
 */

// ─── Role enum ───────────────────────────────────────────────────────────────

export type UserRole =
  | "SUPER_DEV"
  | "ADMIN"
  | "LEAD_ARCHITECT"
  | "REVIEWER"
  | "DEVELOPER"
  | "VIEWER";

// ─── Permission enum ─────────────────────────────────────────────────────────

export type Permission =
  // AI Engine
  | "use_live_ai_engine"
  | "configure_ai_api_keys"
  // Projects
  | "create_project"
  | "delete_project"
  | "view_all_projects"
  | "view_own_projects"
  // Audit
  | "run_core_audit"
  | "run_impact_audit"
  | "view_audit_results"
  // Blueprint
  | "view_blueprint"
  | "approve_blueprint_step"
  | "reject_blueprint_step"
  | "approve_all_blueprint_steps"
  | "regenerate_blueprint"
  // Transform
  | "trigger_transform"
  | "view_transform_output"
  // Report
  | "view_report"
  | "export_report_pdf"
  | "export_rust_code"
  // Settings & Admin
  | "view_settings"
  | "manage_users"
  | "view_system_logs"
  | "view_integrations"
  | "manage_integrations";

// ─── Permission map ───────────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_DEV: [
    "use_live_ai_engine",
    "configure_ai_api_keys",
    "create_project",
    "delete_project",
    "view_all_projects",
    "view_own_projects",
    "run_core_audit",
    "run_impact_audit",
    "view_audit_results",
    "view_blueprint",
    "approve_blueprint_step",
    "reject_blueprint_step",
    "approve_all_blueprint_steps",
    "regenerate_blueprint",
    "trigger_transform",
    "view_transform_output",
    "view_report",
    "export_report_pdf",
    "export_rust_code",
    "view_settings",
    "manage_users",
    "view_system_logs",
    "view_integrations",
    "manage_integrations",
  ],

  ADMIN: [
    "create_project",
    "delete_project",
    "view_all_projects",
    "view_own_projects",
    "run_core_audit",
    "run_impact_audit",
    "view_audit_results",
    "view_blueprint",
    "approve_blueprint_step",
    "reject_blueprint_step",
    "approve_all_blueprint_steps",
    "regenerate_blueprint",
    "trigger_transform",
    "view_transform_output",
    "view_report",
    "export_report_pdf",
    "export_rust_code",
    "view_settings",
    "manage_users",
    "view_system_logs",
    "view_integrations",
    "manage_integrations",
  ],

  LEAD_ARCHITECT: [
    "create_project",
    "view_all_projects",
    "view_own_projects",
    "run_core_audit",
    "run_impact_audit",
    "view_audit_results",
    "view_blueprint",
    "approve_blueprint_step",
    "reject_blueprint_step",
    "approve_all_blueprint_steps",
    "regenerate_blueprint",
    "trigger_transform",
    "view_transform_output",
    "view_report",
    "export_report_pdf",
    "export_rust_code",
    "view_settings",
    "view_integrations",
  ],

  REVIEWER: [
    "view_own_projects",
    "view_audit_results",
    "view_blueprint",
    "approve_blueprint_step",
    "reject_blueprint_step",
    "view_transform_output",
    "view_report",
    "view_settings",
  ],

  DEVELOPER: [
    "create_project",
    "view_own_projects",
    "run_core_audit",
    "run_impact_audit",
    "view_audit_results",
    "view_blueprint",
    "trigger_transform",
    "view_transform_output",
    "view_report",
    "export_rust_code",
    "view_settings",
  ],

  VIEWER: [
    "view_own_projects",
    "view_audit_results",
    "view_blueprint",
    "view_transform_output",
    "view_report",
  ],
};

// ─── Account isolation ────────────────────────────────────────────────────────

/**
 * Maps a username to its fixed role.
 * Hardcoded accounts always get their designated role regardless of DB.
 */
const HARDCODED_ACCOUNT_ROLES: Record<string, UserRole> = {
  baanbhaba: "SUPER_DEV",
  admin: "ADMIN",
};

export function getRoleForUsername(username: string): UserRole {
  return HARDCODED_ACCOUNT_ROLES[username.toLowerCase()] ?? "DEVELOPER";
}

// ─── Core permission checker ──────────────────────────────────────────────────

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

// ─── Role display helpers ─────────────────────────────────────────────────────

export const ROLE_DISPLAY: Record<UserRole, { label: string; description: string; color: string }> = {
  SUPER_DEV: {
    label: "Super Developer",
    description: "Internal developer with full system access and live AI engine control.",
    color: "amber",
  },
  ADMIN: {
    label: "Administrator",
    description: "Organisation administrator with full read/write access.",
    color: "blue",
  },
  LEAD_ARCHITECT: {
    label: "Lead Architect",
    description: "Can approve all blueprint steps and manage the migration pipeline.",
    color: "violet",
  },
  REVIEWER: {
    label: "Reviewer",
    description: "Can review and approve/reject blueprint steps.",
    color: "green",
  },
  DEVELOPER: {
    label: "Developer",
    description: "Can upload code, trigger transformations, and view reports.",
    color: "zinc",
  },
  VIEWER: {
    label: "Viewer",
    description: "Read-only access to assigned projects.",
    color: "zinc",
  },
};
