import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetKitchenOrders(restaurantId?: number) {
  return useQuery({
    queryKey: ["getKitchenOrders", restaurantId],
    refetchInterval: 15000, // live kitchen display
    queryFn: async () => {
      try {
        const q = restaurantId ? `?restaurant_id=${restaurantId}` : "";
        const res = await axiosInstance.get(
          `/api/restaurants/v1/restaurants/kitchen/orders/${q}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
        return [];
      }
    },
  });
}

export default useGetKitchenOrders;
