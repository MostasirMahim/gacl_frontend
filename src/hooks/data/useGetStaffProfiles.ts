import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetStaffProfiles() {
  return useQuery({
    queryKey: ["getStaffProfiles"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/attendance/v1/attendance/staff/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch staff");
        return [];
      }
    },
  });
}

export default useGetStaffProfiles;
