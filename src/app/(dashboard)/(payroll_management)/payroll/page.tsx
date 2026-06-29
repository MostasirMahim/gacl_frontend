"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateRunForm from "@/components/payroll/GenerateRunForm";
import PayrollRunsList from "@/components/payroll/PayrollRunsList";
import SalaryStructureForm from "@/components/payroll/SalaryStructureForm";
import SalaryComponentForm from "@/components/payroll/SalaryComponentForm";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

const PAYROLL_TABS: TabConfig[] = [
  { value: "runs", permission: "payroll:view_structures" },
  { value: "generate", permission: "payroll:run_generate" },
  { value: "structures", permission: "payroll:edit_structure" },
  { value: "components", permission: "payroll:edit_structure" },
];

export default function PayrollPage() {
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(PAYROLL_TABS, "runs");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payroll</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {hasPermission("payroll:view_structures") && <TabsTrigger value="runs">Payroll Runs</TabsTrigger>}
          {hasPermission("payroll:run_generate") && <TabsTrigger value="generate">Generate Run</TabsTrigger>}
          {hasPermission("payroll:edit_structure") && <TabsTrigger value="structures">Salary Structure</TabsTrigger>}
          {hasPermission("payroll:edit_structure") && <TabsTrigger value="components">Components</TabsTrigger>}
        </TabsList>
        <TabsContent value="runs" className="mt-4">
          <PermissionGuard permission="payroll:view_structures" fallback={<RestrictedAccessPlaceholder featureName="Payroll Runs" requiredPermission="payroll:view_structures" />}>
            <PayrollRunsList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="generate" className="mt-4">
          <PermissionGuard permission="payroll:run_generate" fallback={<RestrictedAccessPlaceholder featureName="Generate Run" requiredPermission="payroll:run_generate" />}>
            <GenerateRunForm />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="structures" className="mt-4">
          <PermissionGuard permission="payroll:edit_structure" fallback={<RestrictedAccessPlaceholder featureName="Salary Structure" requiredPermission="payroll:edit_structure" />}>
            <SalaryStructureForm />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="components" className="mt-4">
          <PermissionGuard permission="payroll:edit_structure" fallback={<RestrictedAccessPlaceholder featureName="Payroll Components" requiredPermission="payroll:edit_structure" />}>
            <SalaryComponentForm />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
