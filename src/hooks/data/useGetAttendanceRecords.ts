import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetAttendanceRecords(subjectType?: string) {
  return useQuery({
    queryKey: ["getAttendanceRecords", subjectType],
    queryFn: async () => {
      try {
        const q = subjectType ? `?subject_type=${subjectType}` : "";
        const res = await axiosInstance.get(
          `/api/attendance/v1/attendance/records/${q}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch attendance");
        return [];
      }
    },
  });
}

export default useGetAttendanceRecords;
