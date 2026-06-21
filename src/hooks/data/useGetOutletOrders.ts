import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetOutletOrders(params?: string) {
  return useQuery({
    queryKey: ["getOutletOrders", params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/outlet/v1/outlets/orders/${params || ""}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
        return [];
      }
    },
  });
}

export default useGetOutletOrders;
