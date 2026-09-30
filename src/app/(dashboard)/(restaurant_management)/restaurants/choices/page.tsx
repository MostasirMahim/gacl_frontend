import ShowRestaurantChoices from "@/components/restaurant/ShowRestaurantChoices";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { BookCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function RestaurantChoicesPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  let cuisinesData: any = {};
  let categoriesData: any = {};
  page = page || "1";

  try {
    const [cuisinesRes, categoriesRes] = await Promise.all([
      axiosInstance.get(
        `/api/restaurants/v1/restaurants/cusines/?page=${page}&page_size=50`,
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
      axiosInstance.get(
        `/api/restaurants/v1/restaurants/categories/?page=${page}&page_size=50`,
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
    console.error("Error occurred fetching choices", error);
    const errorMsg = error?.response?.data?.message || "Failed to load choices";
    throw new Error(errorMsg);
  }

  return (
    <div className="space-y-5">
      {/* ── Universal Page Header ────────────────────────────── */}
      <PageHeader
        title="Menu Choices & Classifications"
        subtitle="Cuisine categories and dining venue types for club menus."
        breadcrumbs={[
          { label: "Restaurants", href: "/restaurants" },
          { label: "Menu Choices" },
        ]}
        icon={<BookCheck className="w-5 h-5" />}
        actions={
          <Link href="/restaurants">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9 font-medium shadow-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Venues Hub
            </Button>
          </Link>
        }
      />

      {/* ── Dual Panel Grid: Cuisines & Categories ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <ShowRestaurantChoices data={cuisinesData} state="cuisine" />
        </div>
        <div>
          <ShowRestaurantChoices data={categoriesData} state="category" />
        </div>
      </div>
    </div>
  );
}

export default RestaurantChoicesPage;
