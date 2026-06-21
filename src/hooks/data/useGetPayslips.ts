import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetPayslips(params?: string) {
  return useQuery({
    queryKey: ["getPayslips", params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/payroll/v1/payroll/payslips/${params || ""}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch payslips");
        return [];
      }
    },
  });
}

export default useGetPayslips;
