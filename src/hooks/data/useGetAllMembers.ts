import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Filters = {
  date_of_birth?: Date;
  membership_type?: string;
  membership_status?: string;
  application_status?: string;
  blood_group?: string;
  gender?: string;
  institute_name?: string;
  marital_status?: string;
  nationality?: string;
  contact_number?: string;
  email?: string;
  member_ID?: string;
  name?: string;
};

function useGetAllMembers(
  page: number = 1,
  filters: Filters = {},
  routes: number = 1,
) {
  return useQuery({
    queryKey: ["getAllMembers", page, routes, filters],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        Object.entries(filters).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") return;
          if (key === "date_of_birth" && value instanceof Date) {
            params.append(key, value.toISOString().split("T")[0]);
          } else {
            params.append(key, String(value));
          }
        });

        const res = await axiosInstance.get(
          `/api/member/v1/members/list/?${params.toString()}`,
        );
        if (res?.data?.status == "success") {
          return res.data;
        } else {
          toast.error("Failed to fetch Members");
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching:", error);
        toast(error?.response?.data?.message || "Failed to fetch Members");
        return [];
      }
    },
  });
}

export async function exportMembersExcel(
  page: number = 1,
  filters: Filters = {},
) {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      if (key === "date_of_birth" && value instanceof Date) {
        params.append(key, value.toISOString().split("T")[0]);
      } else {
        params.append(key, String(value));
      }
    });

    params.append("download_excel", "true");

    const res = await axiosInstance.get(
      `/api/member/v1/members/list/?${params.toString()}`,
      { responseType: "blob" },
    );
    const blob = new Blob([res.data], {
      type: res.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "memberlist.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    if (res?.status === 200) {
      toast.success("Excel exported successfully");
    } else {
      toast.error("Failed to export Members");
    }
  } catch (error: any) {
    toast.error("Failed to export Members");
  }
}

export default useGetAllMembers;
