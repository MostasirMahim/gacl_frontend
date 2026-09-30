"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KitchenDisplay from "@/components/restaurant_ordering/KitchenDisplay";
import OrdersList from "@/components/restaurant_ordering/OrdersList";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";
import PageHeader from "@/components/common/PageHeader";
import { ChefHat, ListOrdered, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RESTAURANT_ORDER_TABS: TabConfig[] = [
  { value: "kitchen", permission: "restaurant:kitchen_update" },
  { value: "orders", permission: "restaurant:order_create" },
];

export default function RestaurantOrdersPage() {
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(
    RESTAURANT_ORDER_TABS,
    "kitchen"
  );

  return (
    <div className="w-full space-y-6 pb-8">
      <PageHeader
        title="Kitchen Display System (KDS)"
        subtitle="Real-time kitchen order tickets, interactive prep pipeline, and order settlements."
        breadcrumbs={[
          { label: "Restaurants", href: "/restaurants" },
          { label: "Kitchen Orders & KDS" },
        ]}
        icon={ChefHat}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/restaurants/checkout">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-9 font-medium shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-primary" /> Touch POS
              </Button>
            </Link>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-card p-1 border border-border/70 rounded-xl shadow-xs h-10">
            {hasPermission("restaurant:kitchen_update") && (
              <TabsTrigger
                value="kitchen"
                className="gap-2 text-xs font-semibold px-4 data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-lg"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                Live Kitchen Display (KDS)
              </TabsTrigger>
            )}
            {hasPermission("restaurant:order_create") && (
              <TabsTrigger
                value="orders"
                className="gap-2 text-xs font-semibold px-4 data-[state=active]:bg-muted data-[state=active]:text-foreground rounded-lg"
              >
                <ListOrdered className="w-3.5 h-3.5 text-blue-500" />
                All Orders Registry
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="kitchen" className="m-0 focus-visible:outline-none">
          <PermissionGuard
            permission="restaurant:kitchen_update"
            fallback={
              <RestrictedAccessPlaceholder
                featureName="Kitchen Display"
                requiredPermission="restaurant:kitchen_update"
              />
            }
          >
            <KitchenDisplay />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="orders" className="m-0 focus-visible:outline-none">
          <PermissionGuard
            permission="restaurant:order_create"
            fallback={
              <RestrictedAccessPlaceholder
                featureName="All Orders"
                requiredPermission="restaurant:order_create"
              />
            }
          >
            <OrdersList />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
