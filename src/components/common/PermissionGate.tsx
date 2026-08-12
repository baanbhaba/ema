/**
 * PermissionGate — Conditionally renders children based on user permissions.
 *
 * Usage:
 *   <PermissionGate permission="trigger_transform">
 *     <TransformButton />
 *   </PermissionGate>
 *
 *   <PermissionGate permission="manage_users" fallback={<p>Access denied</p>}>
 *     <UserManagementPanel />
 *   </PermissionGate>
 */

import React from "react";
import { usePermissions } from "../../lib/usePermissions";
import type { Permission } from "../../lib/permissions";
import { Lock } from "lucide-react";

interface PermissionGateProps {
  /** Single permission required */
  permission?: Permission;
  /** Any of these permissions (OR) */
  anyOf?: Permission[];
  /** All of these permissions (AND) */
  allOf?: Permission[];
  /** What to render when access is denied. Defaults to null. */
  fallback?: React.ReactNode;
  /** If true, renders a styled locked UI instead of nothing */
  showLocked?: boolean;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  anyOf,
  allOf,
  fallback = null,
  showLocked = false,
  children,
}) => {
  const { can, canAny, canAll } = usePermissions();

  let allowed = true;

  if (permission) allowed = allowed && can(permission);
  if (anyOf && anyOf.length > 0) allowed = allowed && canAny(anyOf);
  if (allOf && allOf.length > 0) allowed = allowed && canAll(allOf);

  if (allowed) return <>{children}</>;

  if (showLocked) {
    return (
      <div className="flex items-center space-x-1.5 text-xs text-zinc-400 dark:text-zinc-600 font-mono cursor-not-allowed select-none">
        <Lock className="w-3 h-3" />
        <span>Insufficient permissions</span>
      </div>
    );
  }

  return <>{fallback}</>;
};
