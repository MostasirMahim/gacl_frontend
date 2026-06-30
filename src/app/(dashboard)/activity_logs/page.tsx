export const dynamic = "force-dynamic";
export const revalidate = 0;
import ActivityLog from "@/components/activity_log/ActivityLog";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

import RestrictedAccessPlaceholder from "@/components/common/RestrictedAccessPlaceholder";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function ActivityLogPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(
      `/api/activity_log/v1/activity/all_user_activity/?page=${page}`,
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
            featureName="System Activity Logs"
            requiredPermission="activity_log:view"
          />
        </div>
      );
    }
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ALL Activity Logs
          </h1>
          <p className="hidden sm:block text-muted-foreground">
            A list of all activity logs in the system.
          </p>
          <p className="sm:hidden text-muted-foreground">
           List of all activity logs.
          </p>
        </div>
        <div>
          <RefreshButton />
        </div>
      </div>
      <div className="w-full">
        <ActivityLog data={responseData} />
      </div>
    </div>
  );
}

export default ActivityLogPage;
