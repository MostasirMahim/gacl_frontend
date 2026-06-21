import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetOutlets(outletType?: string) {
  return useQuery({
    queryKey: ["getOutlets", outletType],
    queryFn: async () => {
      try {
        const q = outletType ? `?outlet_type=${outletType}` : "";
        const res = await axiosInstance.get(`/api/outlet/v1/outlets/${q}`);
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch outlets");
        return [];
      }
    },
  });
}

export default useGetOutlets;
