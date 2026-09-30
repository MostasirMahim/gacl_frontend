import RestaurantItemAddForm from "@/components/restaurant/RestaurantItemAddForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

async function RestaurantItemsAdd() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let restaurantData = {};
  let categoryData = {};

  try {
    const [restaurantRes, categoriesRes] = await Promise.all([
      axiosInstance.get(`/api/restaurants/v1/restaurants/?page_size=200`, {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/categories/?page_size=200`,
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
    ]);
    restaurantData = restaurantRes.data;
    categoryData = categoriesRes.data;
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="space-y-6">
      {/* Universal Page Header */}
      <PageHeader
        title="Create Menu Dish"
        subtitle="Add a new culinary creation, set portion pricing, stock levels, and assign to a venue."
        breadcrumbs={[
          { label: "Restaurants", href: "/restaurants" },
          { label: "New Menu Item" },
        ]}
        actions={
          <Link href="/restaurants">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-9 font-medium shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Cancel & Return
            </Button>
          </Link>
        }
      />

      <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-xs">
        <RestaurantItemAddForm
          categoriesData={categoryData}
          restaurantData={restaurantData}
        />
      </div>
    </div>
  );
}

export default RestaurantItemsAdd;
