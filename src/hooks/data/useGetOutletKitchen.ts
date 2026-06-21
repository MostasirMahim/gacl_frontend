import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetOutletKitchen(outletId?: number) {
  return useQuery({
    queryKey: ["getOutletKitchen", outletId],
    refetchInterval: 15000,
    queryFn: async () => {
      try {
        const q = outletId ? `?outlet_id=${outletId}` : "";
        const res = await axiosInstance.get(
          `/api/outlet/v1/outlets/kitchen/orders/${q}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch queue");
        return [];
      }
    },
  });
}

export default useGetOutletKitchen;
