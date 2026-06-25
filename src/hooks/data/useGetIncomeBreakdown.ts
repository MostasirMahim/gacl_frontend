import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetIncomeBreakdown(start?: string, end?: string) {
  return useQuery({
    queryKey: ["getIncomeBreakdown", start, end],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (start) params.append("start", start);
        if (end) params.append("end", end);
        const qs = params.toString() ? `?${params.toString()}` : "";
        const res = await axiosInstance.get(
          `/api/finance_core/v1/finance/reports/income-breakdown/${qs}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch income breakdown");
        return null;
      }
    },
  });
}

export default useGetIncomeBreakdown;
