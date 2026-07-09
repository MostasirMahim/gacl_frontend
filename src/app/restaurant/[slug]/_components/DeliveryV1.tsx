import Link from 'next/link';
import Image from 'next/image';
import staticData from "../assets/staticData.json";

interface RestaurantType {
    delivery_banner_title?: string;
    delivery_banner_text?: string;
}

const DeliveryV1 = ({ restaurant }: { restaurant?: RestaurantType }) => {
    const title = restaurant?.delivery_banner_title || staticData.ui.deliveryV1.title;
    const text = restaurant?.delivery_banner_text || staticData.ui.deliveryV1.text;

    return (
        <>
            <div className="deliverya-process-area shadow dark default-padding bg-dark text-light bg-cover"
                style={{ backgroundImage: `url(${staticData.ui.deliveryV1.bgImage})` }}>
                <div className="shape">
                    <Image src={staticData.ui.deliveryV1.shapeImage} alt="Image Not Found" width={697} height={822} />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5 col-lg-8">
                            <div className="delivary-projcess">
                                <h2>{title}</h2>
                                <p>
                                    {text}
                                </p>
                                <Link className="btn btn-theme btn-md animation mt-10" href={staticData.ui.deliveryV1.buttonHref}>{staticData.ui.deliveryV1.buttonLabel} <i className="far fa-shopping-cart"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliveryV1;