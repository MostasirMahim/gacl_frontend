"use client";

import { useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";

export default function NotFound() {
  const { role, isMember, isLoading } = usePermissions();

  useEffect(() => {
    if (isLoading) return;

    if (isMember) {
      window.location.replace("/portal");
    } else if (role) {
      window.location.replace("/");
    } else {
      window.location.replace("/restaurant");
    }
  }, [isLoading, isMember, role]);

  // Safety fallback: if authorization check takes longer than 1.5s, route to public restaurant landing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        window.location.replace("/restaurant");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return null;
}
