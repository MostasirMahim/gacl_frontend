import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetStaffProfiles(search?: string) {
  return useQuery({
    queryKey: ["getStaffProfiles", search],
    queryFn: async () => {
      try {
        const q = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await axiosInstance.get(
          `/api/attendance/v1/attendance/staff/${q}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch staff");
        return [];
      }
    },
  });
}

export default useGetStaffProfiles;
