import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetOutletItems(outletId?: number, publicOnly = false) {
  return useQuery({
    queryKey: ["getOutletItems", outletId, publicOnly],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (outletId) params.append("outlet_id", String(outletId));
        if (publicOnly) params.append("public", "true");
        const qs = params.toString() ? `?${params.toString()}` : "";
        const res = await axiosInstance.get(`/api/outlet/v1/outlets/items/${qs}`);
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch items");
        return [];
      }
    },
  });
}

export default useGetOutletItems;
