import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetVendorCategories() {
  return useQuery({
    queryKey: ["getVendorCategories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/vendor/v1/vendors/categories/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch categories");
        return [];
      }
    },
  });
}

export default useGetVendorCategories;
