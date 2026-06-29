"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VendorOffersList from "@/components/vendor/VendorOffersList";
import VendorCreateForm from "@/components/vendor/VendorCreateForm";
import VendorPaymentsList from "@/components/vendor/VendorPaymentsList";
import VendorCategoriesList from "@/components/vendor/VendorCategoriesList";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

const VENDOR_TABS: TabConfig[] = [
  { value: "offers", permission: "vendor:view" },
  { value: "payments", permission: "vendor:record_payment" },
  { value: "categories", permission: "vendor:view" },
  { value: "create", permission: "vendor:create" },
];

export default function VendorsPage() {
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(VENDOR_TABS, "offers");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Vendor Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {hasPermission("vendor:view") && <TabsTrigger value="offers">Offers & Selection</TabsTrigger>}
          {hasPermission("vendor:record_payment") && <TabsTrigger value="payments">Payments</TabsTrigger>}
          {hasPermission("vendor:view") && <TabsTrigger value="categories">Categories</TabsTrigger>}
          {hasPermission("vendor:create") && <TabsTrigger value="create">Add Vendor / Offer</TabsTrigger>}
        </TabsList>
        <TabsContent value="offers" className="mt-4">
          <PermissionGuard permission="vendor:view" fallback={<RestrictedAccessPlaceholder featureName="Offers & Selection" requiredPermission="vendor:view" />}>
            <VendorOffersList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <PermissionGuard permission="vendor:record_payment" fallback={<RestrictedAccessPlaceholder featureName="Vendor Payments" requiredPermission="vendor:record_payment" />}>
            <VendorPaymentsList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <PermissionGuard permission="vendor:view" fallback={<RestrictedAccessPlaceholder featureName="Categories" requiredPermission="vendor:view" />}>
            <VendorCategoriesList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="create" className="mt-4">
          <PermissionGuard permission="vendor:create" fallback={<RestrictedAccessPlaceholder featureName="Add Vendor / Offer" requiredPermission="vendor:create" />}>
            <VendorCreateForm />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
