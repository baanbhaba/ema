/**
 * usePermissions — React hook for RBAC permission checks.
 *
 * Usage:
 *   const { can, role, isAdmin, isSuperDev } = usePermissions();
 *   if (can("trigger_transform")) { ... }
 */

import { useAuthStore } from "../store/useAuthStore";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type Permission,
  type UserRole,
} from "./permissions";

export interface UsePermissionsReturn {
  /** The current user's role */
  role: UserRole;
  /** Check if the user has a single permission */
  can: (permission: Permission) => boolean;
  /** Check if the user has ANY of the given permissions */
  canAny: (permissions: Permission[]) => boolean;
  /** Check if the user has ALL of the given permissions */
  canAll: (permissions: Permission[]) => boolean;
  /** Convenience flags */
  isSuperDev: boolean;
  isAdmin: boolean;
  isLeadArchitect: boolean;
  isReviewer: boolean;
  isDeveloper: boolean;
  isViewer: boolean;
  /** True for SUPER_DEV and ADMIN */
  hasElevatedAccess: boolean;
  /** True for users who can approve blueprint steps */
  canReview: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { role } = useAuthStore();

  const can = (permission: Permission) => hasPermission(role, permission);
  const canAny = (permissions: Permission[]) => hasAnyPermission(role, permissions);
  const canAll = (permissions: Permission[]) => hasAllPermissions(role, permissions);

  return {
    role,
    can,
    canAny,
    canAll,
    isSuperDev: role === "SUPER_DEV",
    isAdmin: role === "ADMIN",
    isLeadArchitect: role === "LEAD_ARCHITECT",
    isReviewer: role === "REVIEWER",
    isDeveloper: role === "DEVELOPER",
    isViewer: role === "VIEWER",
    hasElevatedAccess: role === "SUPER_DEV" || role === "ADMIN",
    canReview: hasPermission(role, "approve_blueprint_step"),
  };
}
