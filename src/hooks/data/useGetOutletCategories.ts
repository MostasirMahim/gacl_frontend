import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetOutletCategories() {
  return useQuery({
    queryKey: ["getOutletCategories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/outlet/v1/outlets/categories/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch categories");
        return [];
      }
    },
  });
}

export default useGetOutletCategories;
