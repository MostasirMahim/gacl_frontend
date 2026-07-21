import { redirect } from 'next/navigation';
import axiosInstance from "@/lib/axiosInstance";
import DeliveryV1 from "../_components/DeliveryV1";
import FoodMenuV4 from "../_components/FoodMenuV4";
import FoodMenuV5 from "../_components/FoodMenuV5";
import LayoutV6 from "../_components/LayoutV6";
import ReservationV1 from "../_components/ReservationV1";
import TestimonialV1 from "../_components/TestimonialV1";
import staticData from "../assets/staticData.json";
import BodyDark from "../_components/BodyDark";

interface Params {
    slug: string;
}

interface PageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    try {
        const res = await axiosInstance.get(`/api/restaurants/v1/public/by-slug/${slug}/menu/`);
        const restaurant = res.data.data.restaurant;
        return {
            title: restaurant?.meta_title || `${staticData.ui.menuPage.metaPrefix}${restaurant?.name || staticData.ui.menuPage.defaultTitle}`
        };
    } catch {
        return {
            title: `${staticData.ui.menuPage.metaPrefix}${staticData.ui.menuPage.defaultTitle}`
        };
    }
}

const FoodMenuPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    let data: any = null;
    let isValid = true;
    try {
        const res = await axiosInstance.get(`/api/restaurants/v1/public/by-slug/${slug}/menu/`);
        data = res.data.data;
    } catch (error) {
        console.error("Failed to fetch dynamic restaurant data, using static mock-up defaults:", error);
        isValid = false;
    }

    if (!isValid) {
        redirect('/restaurant');
    }

    const restaurant = data?.restaurant;
    const sections = data?.sections || [];
    const testimonials = data?.testimonials || [];

    const pageTitle = restaurant?.name || staticData.ui.menuPage.defaultTitle;
    const bgImage = restaurant?.banner_bg_image || staticData.ui.menuPage.defaultBgImage;

    return (
        <>
            <LayoutV6 
                breadCrumb="food-menu" 
                title={pageTitle} 
                bgImage={bgImage}
                homePath={`/restaurant/${slug}/menu`}
                footerConfig={restaurant?.footer_config}
            >
                <FoodMenuV4 sections={sections} restaurantSlug={slug} />
                <DeliveryV1 restaurant={restaurant} />
                <FoodMenuV5 sections={sections} restaurantSlug={slug} />
                <TestimonialV1 testimonials={testimonials} />
                <ReservationV1 sectionClass="mb-120 mb-xs-60" restaurant={restaurant} />
                <BodyDark/>
            </LayoutV6>
        </>
    );
};

export default FoodMenuPage;