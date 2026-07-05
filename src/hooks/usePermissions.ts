"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export function usePermissions() {
  const { data: permissionData, isLoading } = useQuery({
    queryKey: ["userPermissionsData"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          "/api/account/v1/authorization/get_user_all_permissions/"
        );
        if (res?.data?.status === "success" && res?.data?.data?.[0]) {
          const item = res.data.data[0];
          const rawPerms: string[] = (item.permissions || []).map(
            (p: any) => p.permission_name
          );
          return {
            username: item.username,
            isAdmin: item.is_superuser || item.is_admin || item.username === "admin" || item.groups?.some((g: any) => g.name === "super_admin" || g.name === "executive_admin"),
            isMember: item.is_member === true,
            memberId: item.member_id ?? null,
            memberID: item.member_ID ?? null,
            memberName: item.member_name ?? null,
            permissions: rawPerms,
          };
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
      }
      return { username: null, isAdmin: false, isMember: false, memberId: null, memberID: null, memberName: null, permissions: [] };
    },
    staleTime: 5 * 60 * 1000,
  });

  const permissions = permissionData?.permissions || [];
  const isAdmin = permissionData?.isAdmin || false;
  const isMember = permissionData?.isMember || false;
  const memberId = permissionData?.memberId || null;
  const memberID = permissionData?.memberID || null;
  const memberName = permissionData?.memberName || null;

  const hasPermission = (permissionName: string | null): boolean => {
    if (!permissionName) return true;
    if (isAdmin) return true;
    
    // Check exact permission match
    return permissions.includes(permissionName);
  };

  const hasAnyPermission = (permList: string[]): boolean => {
    if (isAdmin) return true;
    return permList.some((p) => hasPermission(p));
  };

  return {
    permissions,
    isAdmin,
    isMember,
    memberId,
    memberID,
    memberName,
    isLoading,
    hasPermission,
    hasAnyPermission,
  };
}
