import ViewAllRestaurant from "@/components/restaurant/ViewAllRestaurant";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function RestaurantViewPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let data = {};
  try {
    const response = await axiosInstance.get(
      `/api/restaurants/v1/restaurants/?page=${page}&page_size=20`,
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
    <div>
      <ViewAllRestaurant data={data} />
    </div>
  );
}

export default RestaurantViewPage;
