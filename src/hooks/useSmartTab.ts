"use client";

import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";

export interface TabConfig {
  value: string;
  permission?: string | null;
}

export function useSmartTab(tabs: TabConfig[], fallbackValue: string) {
  const { hasPermission, isLoading } = usePermissions();
  const [activeTab, setActiveTab] = useState<string>(fallbackValue);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !initialized) {
      const allowedTab = tabs.find((t) => !t.permission || hasPermission(t.permission));
      if (allowedTab) {
        setActiveTab(allowedTab.value);
      }
      setInitialized(true);
    }
  }, [isLoading, initialized, tabs, hasPermission]);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    hasPermission,
  };
}
