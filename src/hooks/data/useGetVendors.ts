import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetVendors() {
  return useQuery({
    queryKey: ["getVendors"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/vendor/v1/vendors/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch vendors");
        return [];
      }
    },
  });
}

export default useGetVendors;
