"use client";
import SingleProductGrid from './SingleProductGrid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay } from 'swiper/modules';
import staticData from "../assets/staticData.json";

interface RelatedProductsProps {
    relatedItems?: any[];
    restaurantSlug?: string;
}

const RelatedProducts = ({ relatedItems, restaurantSlug }: RelatedProductsProps) => {
    const list = relatedItems && relatedItems.length > 0 ? relatedItems : staticData.productData;

    return (
        <>
            <div className="related-products carousel-shadow">
                <div className="row">
                    <div className="col-md-12">
                        <h3>{staticData.ui.relatedProducts.heading}</h3>
                        <Swiper className="vt-products text-center related-product-carousel"
                            modules={[Keyboard, Autoplay]}
                            loop={true}
                            slidesPerView={1}
                            spaceBetween={30}
                            autoplay={true}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                },
                                992: {
                                    slidesPerView: 3,
                                },
                                1400: {
                                    slidesPerView: 4,
                                },
                            }}
                        >
                            {list.map(product =>
                                <SwiperSlide key={product.id}>
                                    <SingleProductGrid product={product} restaurantSlug={restaurantSlug} />
                                </SwiperSlide>
                            )}
                        </Swiper>
                    </div>
                </div>
            </div >
        </>
    );
};

export default RelatedProducts;
