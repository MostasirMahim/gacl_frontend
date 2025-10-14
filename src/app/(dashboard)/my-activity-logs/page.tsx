export const dynamic = "force-dynamic";
export const revalidate = 0;
import ActivityLog from "@/components/activity_log/ActivityLog";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

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
      `/api/activity_log/v1/activity/user_activity/?page=${page}`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    responseData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            My Activity Logs
          </h1>
           <p className="hidden sm:block text-muted-foreground">
            A list of all my activity logs in the system.
          </p>
          <p className="sm:hidden text-muted-foreground">
           List of all my activity logs.
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
