"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KitchenDisplay from "@/components/restaurant_ordering/KitchenDisplay";
import OrdersList from "@/components/restaurant_ordering/OrdersList";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

const RESTAURANT_ORDER_TABS: TabConfig[] = [
  { value: "kitchen", permission: "restaurant:kitchen_update" },
  { value: "orders", permission: "restaurant:order_create" },
];

export default function RestaurantOrdersPage() {
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(RESTAURANT_ORDER_TABS, "kitchen");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Restaurant Ordering</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {hasPermission("restaurant:kitchen_update") && (
            <TabsTrigger value="kitchen">Kitchen Display</TabsTrigger>
          )}
          {hasPermission("restaurant:order_create") && (
            <TabsTrigger value="orders">All Orders</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="kitchen" className="mt-4">
          <PermissionGuard
            permission="restaurant:kitchen_update"
            fallback={<RestrictedAccessPlaceholder featureName="Kitchen Display" requiredPermission="restaurant:kitchen_update" />}
          >
            <KitchenDisplay />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <PermissionGuard
            permission="restaurant:order_create"
            fallback={<RestrictedAccessPlaceholder featureName="All Orders" requiredPermission="restaurant:order_create" />}
          >
            <OrdersList />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
