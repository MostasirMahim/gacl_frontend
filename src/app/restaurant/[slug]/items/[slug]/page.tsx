import LayoutV6 from "../../_components/LayoutV6";
import ShopSinglePageContent from "../../_components/shop/ShopSinglePageContent";
import ProductData from "../../assets/jsonData/product/ProductData.json";

export const metadata = {
  title: "Restan - Shop Single",
};

interface Params {
  slug: string;
}

interface PageProps {
  params: Promise<Params>;
}

const ShopSinglePage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const data = ProductData.find((product: any) => product.slug === slug);

  return (
    <>
      <LayoutV6 breadCrumb="shop-single" title="Grilled Flank Steak">
        {data && <ShopSinglePageContent productInfo={data} />}
      </LayoutV6>
    </>
  );
};

export default ShopSinglePage;
