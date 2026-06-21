import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetReservations(params?: string) {
  return useQuery({
    queryKey: ["getReservations", params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/reservation/v1/reservations/${params || ""}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch reservations");
        return [];
      }
    },
  });
}

export default useGetReservations;
