import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetVendorOffers(params?: string) {
  return useQuery({
    queryKey: ["getVendorOffers", params],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/vendor/v1/vendors/offers/${params || ""}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch offers");
        return [];
      }
    },
  });
}

export default useGetVendorOffers;
