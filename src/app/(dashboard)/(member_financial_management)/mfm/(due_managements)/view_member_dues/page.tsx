import ViewMemberDueTable from "@/components/member_financial_management/due/ViewMemberDueTable";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { Layers } from "lucide-react";
import { cookies } from "next/headers";

import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

interface Props {
  searchParams: any;
}

async function PayMemberDue({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/member_dues/?page=${page}`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    responseData = data;
  } catch (error: any) {
    console.log("Error occurred");
    if (error.response?.status === 403) {
      return (
        <div className="p-6">
          <RestrictedAccessPlaceholder
            featureName="Member Dues"
            requiredPermission="member_financial:view_dues"
          />
        </div>
      );
    }
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="w-full bg-background space-y-6">
       <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="text-2xl font-bold">All available member dues</span>
          </div>
          <RefreshButton />
        </div>
      <ViewMemberDueTable data={responseData} />
    </div>
  );
}

export default PayMemberDue;
