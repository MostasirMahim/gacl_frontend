import axiosInstance from "@/lib/axiosInstance";
import LayoutV6 from "../../_components/LayoutV6";
import ShopSinglePageContent from "../../_components/shop/ShopSinglePageContent";
import staticData from "../../assets/staticData.json";

interface Params {
  slug: string;
  itemSlug: string;
}

interface PageProps {
  params: Promise<Params>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, itemSlug } = await params;
  try {
    const res = await axiosInstance.get(
      `/api/restaurants/v1/public/by-slug/${slug}/items/${itemSlug}/detail/`,
    );
    const item = res.data.data.item;
    return {
      title: `${staticData.ui.shopSinglePage.metaPrefix}${item?.name || staticData.ui.shopSinglePage.defaultTitle}`,
    };
  } catch {
    return {
      title: `${staticData.ui.shopSinglePage.metaPrefix}${staticData.ui.shopSinglePage.defaultTitle}`,
    };
  }
}

const ShopSinglePage = async ({ params }: PageProps) => {
  const { slug, itemSlug } = await params;

  let data: any = null;
  let reviews: any[] = [];
  let relatedItems: any[] = [];
  let restaurant: any = null;

  try {
    const res = await axiosInstance.get(
      `/api/restaurants/v1/public/by-slug/${slug}/items/${itemSlug}/detail/`,
    );
    data = res.data.data.item;
    reviews = res.data.data.reviews || [];
    relatedItems = res.data.data.related_items || [];
    restaurant = res.data.data.restaurant;
  } catch (error) {
    console.error(
      "Failed to fetch dynamic item details, falling back to static mockup data:",
      error,
    );
    // Fallback search in static mockup json
    data = staticData.productData.find((product: any) => product.slug === itemSlug);
  }

  const title = data?.name || data?.title || staticData.ui.shopSinglePage.defaultTitle;

  return (
    <>
      <LayoutV6
        breadCrumb="shop-single"
        title={title}
        homePath={`/restaurant/${slug}/menu`}
        footerConfig={restaurant?.footer_config}
      >
        {data && (
          <ShopSinglePageContent
            productInfo={data}
            reviews={reviews}
            relatedItems={relatedItems}
            restaurantSlug={slug}
          />
        )}
      </LayoutV6>
    </>
  );
};

export default ShopSinglePage;
