import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface CardFilters {
  search?: string;
  cardType?: string;
  isAssigned?: string;
}

function useGetRFIDCards(filters: CardFilters = {}) {
  return useQuery({
    queryKey: ["getRFIDCards", filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.cardType) params.append("card_type", filters.cardType);
        if (filters.isAssigned) params.append("is_assigned", filters.isAssigned);
        const s = params.toString();
        const res = await axiosInstance.get(
          `/api/attendance/v1/attendance/cards/${s ? `?${s}` : ""}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch cards");
        return [];
      }
    },
  });
}

export default useGetRFIDCards;
