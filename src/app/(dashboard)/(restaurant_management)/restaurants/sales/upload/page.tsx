import RestaurantSalesUploadForm from "@/components/restaurant/RestaurantSalesUploadForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function RestaurantSalesUploadPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let incomeParticularData = {};
  let receivedFromData = {};
  let restaurantData = {};

  try {
    const [incomeRes, receivedFromRes, restaurantRes] = await Promise.all([
      axiosInstance.get("/api/member_financial/v1/income/particular/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/member_financial/v1/income/receiving_options/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/restaurants/v1/restaurants/?page_size=100", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
    ]);
    incomeParticularData = incomeRes.data;
    receivedFromData = receivedFromRes.data;
    restaurantData = restaurantRes.data;
  } catch (error: any) {
    if (error?.response?.status == 403) {
      redirect("/unauthorized");
    }
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Upload Restaurant Sales Records"
        subtitle="Bulk import daily sales spreadsheets, register income particulars, and sync financial ledger."
        breadcrumbs={[
          { label: "Restaurants", href: "/restaurants" },
          { label: "Sales Ingestion" },
        ]}
        icon={<UploadCloud className="w-5 h-5" />}
        actions={
          <Link href="/restaurants">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9 font-medium shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Venues Hub
            </Button>
          </Link>
        }
      />

      <RestaurantSalesUploadForm
        incomeParticular={incomeParticularData}
        receivedFrom={receivedFromData}
        restaurant={restaurantData}
      />
    </div>
  );
}

export default RestaurantSalesUploadPage;
