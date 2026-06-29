"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGuardProps {
  permission?: string | null;
  anyPermission?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  anyPermission,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) return null;

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
