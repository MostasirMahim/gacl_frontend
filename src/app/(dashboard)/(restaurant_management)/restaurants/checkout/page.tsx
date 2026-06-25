import CheckoutTabs from "@/components/restaurant/CheckoutTabs";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function RestaurantItemCheckoutPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  page = page || "1";
  let memberData = {};
  let promoCodeData = {};

  try {
    const [memberRes, promoCodeRes] = await Promise.all([
      //chenge member list to member ID list API
      axiosInstance.get(`/api/member/v1/members/list/ids/`, {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/promo_code/v1/promo_codes/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
    ]);
    memberData = memberRes.data;
    promoCodeData = promoCodeRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    console.log(error.response?.status); //ToDo:Error: Cannot read properties of undefined (reading 'status')
    if (error.response?.status == 403) {
      redirect("/unauthorized");
    }
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div>
      <CheckoutTabs
        memberData={memberData}
        promoCodeData={promoCodeData}
      />
    </div>
  );
}

export default RestaurantItemCheckoutPage;
