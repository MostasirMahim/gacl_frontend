import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import MemberPieChart2 from "./MemberPieChart2";
import { ChartColumn } from "lucide-react";

async function MemberPieChartSSR2() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let chartData: any = {};

  try {
    const { data } = await axiosInstance.get(
      "/api/dashboard/v1/membership_chart/pie_chart/",
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
        <ChartColumn className="text-primary"/>
        <h4 className="w-full font-[500]">
          Membership types and its percentage of member are shown
        </h4>
      </div>

      <div className="w-full mx-auto">
        <MemberPieChart2 data={chartData.data} />
      </div>
    </div>
  );
}

export default MemberPieChartSSR2;
