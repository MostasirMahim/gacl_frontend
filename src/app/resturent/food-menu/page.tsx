import DeliveryV1 from "../_components/DeliveryV1";
import FoodMenuV4 from "../_components/FoodMenuV4";
import FoodMenuV5 from "../_components/FoodMenuV5";
import LayoutV6 from "../_components/LayoutV6";
import ReservationV1 from "../_components/ReservationV1";
import TestimonialV1 from "../_components/TestimonialV1";

export const metadata = {
    title: "Restan - Food Menu"
};

const FoodMenuPage = () => {
    return (
        <>
            <LayoutV6 breadCrumb="food-menu" title="Food Menu">
                <FoodMenuV4 />
                <DeliveryV1 />
                <FoodMenuV5 />
                <TestimonialV1 />
                <ReservationV1 sectionClass="mb-120 mb-xs-60" />
            </LayoutV6>
        </>
    );
};

export default FoodMenuPage;