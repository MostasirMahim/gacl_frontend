import AddRestaurantForm from "@/components/restaurant/AddRestaruantForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

async function RestaurantAddPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let cuisinesData = {};
  let categoriesData = {};

  try {
    const [cuisinesRes, categoriesRes] = await Promise.all([
      axiosInstance.get(
        "/api/restaurants/v1/restaurants/cusines/?page_size=200",
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
      axiosInstance.get(
        "/api/restaurants/v1/restaurants/categories/?page_size=200",
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
    ]);
    cuisinesData = cuisinesRes.data;
    categoriesData = categoriesRes.data;
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
        title="Register New Restaurant Venue"
        subtitle="Configure restaurant identity, operating schedule, capacity, and public portal showcases."
        breadcrumbs={[
          { label: "Restaurants", href: "/restaurants" },
          { label: "New Venue Registration" },
        ]}
        icon={<Store className="w-5 h-5" />}
        actions={
          <Link href="/restaurants">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9 font-medium shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Cancel & Return
            </Button>
          </Link>
        }
      />

      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xs">
        <AddRestaurantForm
          cuisinesData={cuisinesData}
          categoriesData={categoriesData}
        />
      </div>
    </div>
  );
}

export default RestaurantAddPage;
