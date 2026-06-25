import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetVendorPayments() {
  return useQuery({
    queryKey: ["getVendorPayments"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/vendor/v1/vendors/payments/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch payments");
        return [];
      }
    },
  });
}

export default useGetVendorPayments;
