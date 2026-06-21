"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardScanCheckIn from "@/components/attendance/CardScanCheckIn";
import GuestRegisterForm from "@/components/attendance/GuestRegisterForm";
import StaffGuestToggle from "@/components/attendance/StaffGuestToggle";
import AttendanceRecordsTable from "@/components/attendance/AttendanceRecordsTable";
import useGetAllMembers from "@/hooks/data/useGetAllMembers";
import useGetStaffProfiles from "@/hooks/data/useGetStaffProfiles";

export default function AttendancePage() {
  const { data: membersData } = useGetAllMembers();
  const { data: staffData } = useGetStaffProfiles();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Attendance Management</h1>
      <Tabs defaultValue="scan">
        <TabsList>
          <TabsTrigger value="scan">Check-in</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="guest">Register Guest</TabsTrigger>
          <TabsTrigger value="staff">Staff Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="scan" className="mt-4">
          <CardScanCheckIn />
        </TabsContent>
        <TabsContent value="records" className="mt-4">
          <AttendanceRecordsTable />
        </TabsContent>
        <TabsContent value="guest" className="mt-4">
          <GuestRegisterForm membersData={membersData} staffData={staffData} />
        </TabsContent>
        <TabsContent value="staff" className="mt-4">
          <StaffGuestToggle />
        </TabsContent>
      </Tabs>
    </div>
  );
}
