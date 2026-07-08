import CheckoutContent from "../_components/CheckoutContent";
import LayoutV6 from "../_components/LayoutV6";

export const metadata = {
  title: "Restan - Checkout",
};

const CheckoutPage = ({ params }: { params: { slug: string } }) => {
  return (
    <>
      <LayoutV6 title="Cart Page" breadCrumb="checkout" homePath={`/restaurant/${params.slug}/menu`}>
        <CheckoutContent restaurantSlug={params.slug} />
      </LayoutV6>
    </>
  );
};

export default CheckoutPage;
