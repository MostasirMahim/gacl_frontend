import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import MemberPieChart from "./MemberPieChart";
import { ChartColumn, ChartColumnIncreasing } from "lucide-react";

async function MemberPieChartSSR() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let chartData = {};

  try {
    const { data } = await axiosInstance.get(
      "/api/dashboard/v1/membership_chart/",
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    chartData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="w-full overflow-x-auto space-y-3">
        <div className="flex items-start gap-2 ">
        <ChartColumnIncreasing  className="text-primary"/>
        <p className="font-medium">
          Membership types and its active and pending members are shown
        </p>
      </div>
      <div className="h-[500px] min-w-[500px]">
        <MemberPieChart chartData={chartData} />
      </div>
    </div>
  );
}

export default MemberPieChartSSR;
