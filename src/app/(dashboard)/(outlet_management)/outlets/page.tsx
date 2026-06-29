"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutletForm from "@/components/outlet/OutletForm";
import OutletItemForm from "@/components/outlet/OutletItemForm";
import OutletItemsList from "@/components/outlet/OutletItemsList";
import OutletCategoryManager from "@/components/outlet/OutletCategoryManager";
import CrossOrderingRules from "@/components/outlet/CrossOrderingRules";
import OutletKitchenDisplay from "@/components/outlet/OutletKitchenDisplay";
import OutletOrdersList from "@/components/outlet/OutletOrdersList";
import OutletOrderCreate from "@/components/outlet/OutletOrderCreate";
import OutletInventory from "@/components/outlet/OutletInventory";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

const OUTLET_TABS: TabConfig[] = [
  { value: "kitchen", permission: "outlet:order_create" },
  { value: "neworder", permission: "outlet:order_create" },
  { value: "orders", permission: "outlet:order_create" },
  { value: "outlets", permission: "outlet:menu_edit" },
  { value: "items", permission: "outlet:menu_edit" },
  { value: "itemlist", permission: "outlet:view_menu" },
  { value: "categories", permission: "outlet:menu_edit" },
  { value: "inventory", permission: "outlet:menu_edit" },
  { value: "rules", permission: "outlet:cross_order_rule" },
];

export default function OutletsPage() {
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(OUTLET_TABS, "kitchen");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Outlets — Bar / Tea Lounge / Cigar Lounge</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {hasPermission("outlet:order_create") && <TabsTrigger value="kitchen">Preparation Queue</TabsTrigger>}
          {hasPermission("outlet:order_create") && <TabsTrigger value="neworder">New Order</TabsTrigger>}
          {hasPermission("outlet:order_create") && <TabsTrigger value="orders">Orders</TabsTrigger>}
          {hasPermission("outlet:menu_edit") && <TabsTrigger value="outlets">Outlets</TabsTrigger>}
          {hasPermission("outlet:menu_edit") && <TabsTrigger value="items">Post Item</TabsTrigger>}
          {hasPermission("outlet:view_menu") && <TabsTrigger value="itemlist">Item List</TabsTrigger>}
          {hasPermission("outlet:menu_edit") && <TabsTrigger value="categories">Categories</TabsTrigger>}
          {hasPermission("outlet:menu_edit") && <TabsTrigger value="inventory">Inventory</TabsTrigger>}
          {hasPermission("outlet:cross_order_rule") && <TabsTrigger value="rules">Cross-Ordering Rules</TabsTrigger>}
        </TabsList>
        <TabsContent value="kitchen" className="mt-4">
          <PermissionGuard permission="outlet:order_create" fallback={<RestrictedAccessPlaceholder featureName="Preparation Queue" requiredPermission="outlet:order_create" />}>
            <OutletKitchenDisplay />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="neworder" className="mt-4">
          <PermissionGuard permission="outlet:order_create" fallback={<RestrictedAccessPlaceholder featureName="New Order" requiredPermission="outlet:order_create" />}>
            <OutletOrderCreate onSuccess={() => setActiveTab("kitchen")} />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <PermissionGuard permission="outlet:order_create" fallback={<RestrictedAccessPlaceholder featureName="Outlet Orders" requiredPermission="outlet:order_create" />}>
            <OutletOrdersList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="outlets" className="mt-4">
          <PermissionGuard permission="outlet:menu_edit" fallback={<RestrictedAccessPlaceholder featureName="Outlets Setup" requiredPermission="outlet:menu_edit" />}>
            <OutletForm />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="items" className="mt-4">
          <PermissionGuard permission="outlet:menu_edit" fallback={<RestrictedAccessPlaceholder featureName="Post Item" requiredPermission="outlet:menu_edit" />}>
            <OutletItemForm />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="itemlist" className="mt-4">
          <PermissionGuard permission="outlet:view_menu" fallback={<RestrictedAccessPlaceholder featureName="Item List" requiredPermission="outlet:view_menu" />}>
            <OutletItemsList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <PermissionGuard permission="outlet:menu_edit" fallback={<RestrictedAccessPlaceholder featureName="Categories" requiredPermission="outlet:menu_edit" />}>
            <OutletCategoryManager />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="inventory" className="mt-4">
          <PermissionGuard permission="outlet:menu_edit" fallback={<RestrictedAccessPlaceholder featureName="Inventory" requiredPermission="outlet:menu_edit" />}>
            <OutletInventory />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <PermissionGuard permission="outlet:cross_order_rule" fallback={<RestrictedAccessPlaceholder featureName="Cross-Ordering Rules" requiredPermission="outlet:cross_order_rule" />}>
            <CrossOrderingRules />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
