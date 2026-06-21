import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetCrossRules() {
  return useQuery({
    queryKey: ["getCrossRules"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/outlet/v1/outlets/cross-rules/");
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch rules");
        return [];
      }
    },
  });
}

export default useGetCrossRules;
