import ViewMemberAccountTable from "@/components/member_financial_management/due/ViewMemberAccountTable";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { Layers } from "lucide-react";
import { cookies } from "next/headers";
import React from "react";

import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

interface Props {
  searchParams: any;
}

async function ViewMemberAccountsPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/member_financial/v1/member_accounts/?page=${page}`,
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
            featureName="Member Accounts"
            requiredPermission="member_financial:view_accounts"
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
            <span className="text-2xl font-bold">All available member accounts</span>
          </div>
          <RefreshButton />
        </div>
      <ViewMemberAccountTable data={responseData} />
    </div>
  );
}

export default ViewMemberAccountsPage;
