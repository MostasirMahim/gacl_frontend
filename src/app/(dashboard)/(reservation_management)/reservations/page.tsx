"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from "@/components/reservation/BookingForm";
import ReservationsList from "@/components/reservation/ReservationsList";
import ResourceForm from "@/components/reservation/ResourceForm";
import ResourcesList from "@/components/reservation/ResourcesList";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

const RESERVATION_TABS: TabConfig[] = [
  { value: "book", permission: "reservation:create" },
  { value: "list", permission: "reservation:view" },
  { value: "resources", permission: "reservation:view" },
  { value: "create", permission: "reservation:create" },
];

export default function ReservationsPage() {
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(RESERVATION_TABS, "book");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Reservations</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {hasPermission("reservation:create") && <TabsTrigger value="book">New Booking</TabsTrigger>}
          {hasPermission("reservation:view") && <TabsTrigger value="list">All Reservations</TabsTrigger>}
          {hasPermission("reservation:view") && <TabsTrigger value="resources">Resources</TabsTrigger>}
          {hasPermission("reservation:create") && <TabsTrigger value="create">Add Resource</TabsTrigger>}
        </TabsList>
        <TabsContent value="book" className="mt-4">
          <PermissionGuard permission="reservation:create" fallback={<RestrictedAccessPlaceholder featureName="New Booking" requiredPermission="reservation:create" />}>
            <BookingForm />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <PermissionGuard permission="reservation:view" fallback={<RestrictedAccessPlaceholder featureName="All Reservations" requiredPermission="reservation:view" />}>
            <ReservationsList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="resources" className="mt-4">
          <PermissionGuard permission="reservation:view" fallback={<RestrictedAccessPlaceholder featureName="Resources List" requiredPermission="reservation:view" />}>
            <ResourcesList />
          </PermissionGuard>
        </TabsContent>
        <TabsContent value="create" className="mt-4">
          <PermissionGuard permission="reservation:create" fallback={<RestrictedAccessPlaceholder featureName="Add Resource" requiredPermission="reservation:create" />}>
            <ResourceForm />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
