import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetResources(resourceType?: string) {
  return useQuery({
    queryKey: ["getResources", resourceType],
    queryFn: async () => {
      try {
        const q = resourceType ? `?resource_type=${resourceType}` : "";
        const res = await axiosInstance.get(
          `/api/reservation/v1/reservations/resources/${q}`
        );
        return res?.data;
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to fetch resources");
        return [];
      }
    },
  });
}

export default useGetResources;
