import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetPayrollRuns() {
  return useQuery({
    queryKey: ["getPayrollRuns"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/payroll/v1/payroll/runs/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch payroll runs");
        return [];
      }
    },
  });
}

export default useGetPayrollRuns;
