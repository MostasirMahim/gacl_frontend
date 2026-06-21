import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetProfitLoss(start?: string, end?: string) {
  return useQuery({
    queryKey: ["getProfitLoss", start, end],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (start) params.append("start", start);
        if (end) params.append("end", end);
        const qs = params.toString() ? `?${params.toString()}` : "";
        const res = await axiosInstance.get(
          `/api/finance_core/v1/finance/reports/profit-loss/${qs}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch report");
        return null;
      }
    },
  });
}

export default useGetProfitLoss;
