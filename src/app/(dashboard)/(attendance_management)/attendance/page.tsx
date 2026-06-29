"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardScanCheckIn from "@/components/attendance/CardScanCheckIn";
import GuestRegisterForm from "@/components/attendance/GuestRegisterForm";
import GuestList from "@/components/attendance/GuestList";
import StaffGuestToggle from "@/components/attendance/StaffGuestToggle";
import AttendanceRecordsTable from "@/components/attendance/AttendanceRecordsTable";
import RFIDCardManager from "@/components/attendance/RFIDCardManager";
import useGetAllMembers from "@/hooks/data/useGetAllMembers";
import useGetStaffProfiles from "@/hooks/data/useGetStaffProfiles";
import { useSmartTab, TabConfig } from "@/hooks/useSmartTab";
import PermissionGuard from "@/components/common/PermissionGuard";
import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

const ATTENDANCE_TABS: TabConfig[] = [
  { value: "scan", permission: "attendance:check_in_out" },
  { value: "records", permission: "attendance:view_records" },
  { value: "cards", permission: "attendance:card_issue" },
  { value: "guest", permission: "attendance:guest_register" },
  { value: "guestlist", permission: "attendance:view_records" },
  { value: "staff", permission: "attendance:card_issue" },
];

export default function AttendancePage() {
  const { data: membersData } = useGetAllMembers();
  const { data: staffData } = useGetStaffProfiles();
  const { activeTab, setActiveTab, hasPermission } = useSmartTab(ATTENDANCE_TABS, "scan");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Attendance Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          {hasPermission("attendance:check_in_out") && (
            <TabsTrigger value="scan">Check-in</TabsTrigger>
          )}
          {hasPermission("attendance:view_records") && (
            <TabsTrigger value="records">Records</TabsTrigger>
          )}
          {hasPermission("attendance:card_issue") && (
            <TabsTrigger value="cards">RFID Cards</TabsTrigger>
          )}
          {hasPermission("attendance:guest_register") && (
            <TabsTrigger value="guest">Register Guest</TabsTrigger>
          )}
          {hasPermission("attendance:view_records") && (
            <TabsTrigger value="guestlist">Guest List</TabsTrigger>
          )}
          {hasPermission("attendance:card_issue") && (
            <TabsTrigger value="staff">Staff Permissions</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="scan" className="mt-4">
          <PermissionGuard
            permission="attendance:check_in_out"
            fallback={<RestrictedAccessPlaceholder featureName="Check-in Scan" requiredPermission="attendance:check_in_out" />}
          >
            <CardScanCheckIn />
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <PermissionGuard
            permission="attendance:view_records"
            fallback={<RestrictedAccessPlaceholder featureName="Attendance Records" requiredPermission="attendance:view_records" />}
          >
            <AttendanceRecordsTable />
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="cards" className="mt-4">
          <PermissionGuard
            permission="attendance:card_issue"
            fallback={<RestrictedAccessPlaceholder featureName="RFID Card Management" requiredPermission="attendance:card_issue" />}
          >
            <RFIDCardManager />
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="guest" className="mt-4">
          <PermissionGuard
            permission="attendance:guest_register"
            fallback={<RestrictedAccessPlaceholder featureName="Register Guest" requiredPermission="attendance:guest_register" />}
          >
            <GuestRegisterForm membersData={membersData} staffData={staffData} />
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="guestlist" className="mt-4">
          <PermissionGuard
            permission="attendance:view_records"
            fallback={<RestrictedAccessPlaceholder featureName="Guest List" requiredPermission="attendance:view_records" />}
          >
            <GuestList />
          </PermissionGuard>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <PermissionGuard
            permission="attendance:card_issue"
            fallback={<RestrictedAccessPlaceholder featureName="Staff Permissions" requiredPermission="attendance:card_issue" />}
          >
            <StaffGuestToggle />
          </PermissionGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
