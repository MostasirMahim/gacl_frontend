import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetRestaurantOrders(params?: string) {
  return useQuery({
    queryKey: ["getRestaurantOrders", params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/restaurants/v1/restaurants/orders/${params || ""}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
        return [];
      }
    },
  });
}

export default useGetRestaurantOrders;
