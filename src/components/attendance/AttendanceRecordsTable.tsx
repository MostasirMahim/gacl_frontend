"use client";
import { useState } from "react";
import useGetAttendanceRecords from "@/hooks/data/useGetAttendanceRecords";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingDots } from "@/components/ui/loading";

function AttendanceRecordsTable() {
  const [subject, setSubject] = useState<string>("");
  const { data, isLoading } = useGetAttendanceRecords(subject || undefined);
  const records = data?.data || data?.results || [];

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
      <Tabs value={subject || "all"} onValueChange={(v) => setSubject(v === "all" ? "" : v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="member">Members</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="guest">Guests</TabsTrigger>
        </TabsList>
      </Tabs>
      {isLoading ? (
        <LoadingDots />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="capitalize">{r.subject_type}</TableCell>
                <TableCell>{new Date(r.check_in).toLocaleString()}</TableCell>
                <TableCell>
                  {r.check_out ? new Date(r.check_out).toLocaleString() : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={r.check_out ? "secondary" : "default"}>
                    {r.check_out ? "Checked out" : "Present"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AttendanceRecordsTable;
