// components/activity-log.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";

// Define the props for the component
interface ActivityLogProps {
  data: any;
}

// Function to format the timestamp
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export async function DashBoardActivityLog() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData: any = {};
  let logs = [];
  try {
    const { data } = await axiosInstance.get(
      `/api/activity_log/v1/activity/user_activity/?page=1&page_size=5`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    responseData = data;
    logs = responseData.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent activity from your works.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full pr-4">
          <div className="">
            {logs?.map((log: any) => (
              <div key={log.id} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2 my-1">
                  <Badge variant="default">{log.user}</Badge>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{log.verb}</span>:{" "}
                    {log.description} {" -"}
                     {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
