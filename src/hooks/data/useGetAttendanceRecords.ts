import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface AttendanceFilters {
  subjectType?: string;
  search?: string;
  today?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

function buildQuery(f: AttendanceFilters) {
  const params = new URLSearchParams();
  if (f.subjectType) params.append("subject_type", f.subjectType);
  if (f.search) params.append("search", f.search);
  if (f.today) params.append("today", "true");
  if (f.dateFrom) params.append("date_from", f.dateFrom);
  if (f.dateTo) params.append("date_to", f.dateTo);
  if (f.page) params.append("page", String(f.page));
  const s = params.toString();
  return s ? `?${s}` : "";
}

function useGetAttendanceRecords(filters: AttendanceFilters = {}) {
  return useQuery({
    queryKey: ["getAttendanceRecords", filters],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/attendance/v1/attendance/records/${buildQuery(filters)}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch attendance"
        );
        return [];
      }
    },
  });
}

export default useGetAttendanceRecords;
