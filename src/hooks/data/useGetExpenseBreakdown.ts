import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetExpenseBreakdown(by: "category" | "module" = "category") {
  return useQuery({
    queryKey: ["getExpenseBreakdown", by],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/finance_core/v1/finance/reports/expense-breakdown/?by=${by}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch breakdown");
        return null;
      }
    },
  });
}

export default useGetExpenseBreakdown;
