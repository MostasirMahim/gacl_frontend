import { Suspense } from "react";
import DashBoardCard from "@/components/DashBoard/DashBoardCard";
import DashboardFilterButton from "@/components/DashBoard/DashboardFilterButton";
import MemberPieChartSSR from "@/components/DashBoard/MemberPieChartSSR";
import MemberPieChartSSR2 from "@/components/DashBoard/MemberPieChartSSR2";
import DashboardLoader from "@/components/loader/DashboardLoader";
import { DashBoardActivityLog } from "@/components/DashBoard/DashBoardActivityLog";
import { DashBoardInfo } from "@/components/DashBoard/DashboardInfo";
import { KPICards } from "@/components/DashBoard/DashBoardKPICard";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{
    created_at?: string;
    created_at_after?: string;
    created_at_before?: string;
  }>;
}

async function Home({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  if (authToken === "") {
    return <DashboardLoader />;
  }

  return (
    <div className="flex flex-col gap-5 font-primary">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="hidden sm:block text-muted-foreground text-sm sm:text-base">
            Welcome back, Here's what's happening with your club.
          </p>
          <p className="sm:hidden text-muted-foreground text-sm sm:text-base">
            Welcome to your dashboard...
          </p>
        </div>
        <div className="flex gap-2 justify-end sm:justify-start">
          <DashboardFilterButton />
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<DashboardLoader />}>
        <DashBoardCard searchParams={searchParams} />
      </Suspense>

      {/* charts */}
      <div className="shadow p-4 rounded-lg border border-border">
        <h4 className="text-xl font-bold mb-4">Analytical data</h4>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 w-full md:w-1/2 md:border-r-2 border-primary">
            <Suspense fallback={<DashboardLoader />}>
              <MemberPieChartSSR />
            </Suspense>
          </div>
          <div className="w-full md:w-1/2">
            <Suspense fallback={<DashboardLoader />}>
              <MemberPieChartSSR2 />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Suspense fallback={<DashboardLoader />}>
          <KPICards />
        </Suspense>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 space-y-4">
        <div className="flex-1 border-border">
          <Suspense fallback={<DashboardLoader />}>
            <DashBoardActivityLog />
          </Suspense>
        </div>
        <div className="flex-1 border-border w-full">
          <DashBoardInfo />
        </div>
      </div>
    </div>
  );
}

export default Home;
