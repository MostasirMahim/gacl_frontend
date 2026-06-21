import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetGuests() {
  return useQuery({
    queryKey: ["getGuests"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/attendance/v1/attendance/guests/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch guests");
        return [];
      }
    },
  });
}

export default useGetGuests;
