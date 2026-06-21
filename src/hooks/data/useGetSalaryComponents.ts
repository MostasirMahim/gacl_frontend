import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetSalaryComponents() {
  return useQuery({
    queryKey: ["getSalaryComponents"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/payroll/v1/payroll/components/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch components");
        return [];
      }
    },
  });
}

export default useGetSalaryComponents;
