import ItemTable from "@/components/restaurant/ItemTable";
import RestaurantManagePanel from "@/components/restaurant/RestaurantManagePanel";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function SpecificRestaurantView({ params, searchParams }: Props) {
  const { id } = await params;
  const cookieStore = cookies();
  let { page } = await searchParams;
  page = page || "1";
  const authToken = cookieStore.get("access_token")?.value || "";
  let data = {};
  try {
    const response = await axiosInstance.get(
      `/api/restaurants/v1/restaurants/items/?restaurant=${id}&page=${page}`,
      {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }
    );
    data = response.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error);
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div className="space-y-6">
      <RestaurantManagePanel restaurantId={id} />
      <ItemTable restaurantId={id} itemsData={data} />
    </div>
  );
}

export default SpecificRestaurantView;
