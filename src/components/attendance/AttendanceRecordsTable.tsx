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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingDots } from "@/components/ui/loading";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Download } from "lucide-react";

function AttendanceRecordsTable() {
  const [subject, setSubject] = useState<string>("");
  const [search, setSearch] = useState("");
  const [today, setToday] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAttendanceRecords({
    subjectType: subject || undefined,
    search: search || undefined,
    today: today || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
  });

  const records = data?.data || data?.results || [];
  const pagination = data?.pagination;

  const exportCsv = async () => {
    try {
      const params = new URLSearchParams();
      if (subject) params.append("subject_type", subject);
      if (search) params.append("search", search);
      if (today) params.append("today", "true");
      if (dateFrom) params.append("date_from", dateFrom);
      if (dateTo) params.append("date_to", dateTo);
      const res = await axiosInstance.get(
        `/api/attendance/v1/attendance/records/export/?${params.toString()}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_records.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Attendance Records</h2>
        <Button onClick={exportCsv} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <Tabs
        value={subject || "all"}
        onValueChange={(v) => {
          setSubject(v === "all" ? "" : v);
          setPage(1);
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="member">Members</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="guest">Guests</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Search (name / ID)</label>
          <Input
            placeholder="Search by member name or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">From</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setToday(false);
              setPage(1);
            }}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">To</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setToday(false);
              setPage(1);
            }}
          />
        </div>
        <Button
          variant={today ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setToday((t) => !t);
            setDateFrom("");
            setDateTo("");
            setPage(1);
          }}
        >
          Today
        </Button>
        {(search || today || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setToday(false);
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingDots />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Card</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="capitalize">{r.subject_type}</TableCell>
                  <TableCell>{r.subject_identifier || "—"}</TableCell>
                  <TableCell>{r.subject_name || "—"}</TableCell>
                  <TableCell>{r.card_uid || "—"}</TableCell>
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                Page {pagination.current_page} of {pagination.total_pages} (
                {pagination.count} records)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.previous}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AttendanceRecordsTable;
