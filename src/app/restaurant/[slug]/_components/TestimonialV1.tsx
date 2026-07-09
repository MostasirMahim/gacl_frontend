"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import SingleTestimonialV1 from './SingleTestimonialV1';
import staticData from "../assets/staticData.json";

interface TestimonialType {
    id: number;
    rating?: number;
    ratings?: number;
    rate?: string;
    title: string;
    text: string;
    name: string;
    designation: string;
}

interface TestimonialV1Props {
    testimonials?: TestimonialType[];
}

const TestimonialV1 = ({ testimonials }: TestimonialV1Props) => {
    const list = testimonials && testimonials.length > 0 ? testimonials : staticData.testimonialV1Data;

    return (
        <>
            <div className="testimonial-area bg-gray default-padding">
                <div className="testimonial-shape">
                    <Image src={staticData.ui.testimonialV1.shapeImages[0]} width={636} height={500} alt="Image Not Found" />
                    <Image src={staticData.ui.testimonialV1.shapeImages[1]} width={750} height={500} alt="Image Not Found" />
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="site-heading text-center">
                                <h4 className="sub-title">{staticData.ui.testimonialV1.subTitle}</h4>
                                <h2 className="title">{staticData.ui.testimonialV1.title}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row align-center ">
                        <div className="col-lg-5">
                            <div className="testimonial-thumb">
                                <Image src={staticData.ui.testimonialV1.thumbImages[0]} width={200} height={200} alt="Image Not Found" />
                                <Image src={staticData.ui.testimonialV1.thumbImages[1]} width={200} height={200} alt="Image Not Found" />
                                <Image src={staticData.ui.testimonialV1.thumbImages[2]} width={200} height={200} alt="Image Not Found" />
                                <Image src={staticData.ui.testimonialV1.thumbImages[3]} width={200} height={200} alt="Image Not Found" />
                            </div>
                        </div>
                        <div className="col-lg-6 offset-lg-1">
                            <Swiper
                                className="testimonial-carousel"
                                modules={[Keyboard, Autoplay, Navigation, Pagination]}
                                direction={'horizontal'}
                                loop={true}
                                autoplay={false}
                                pagination={{
                                    el: ".swiper-pagination",
                                    clickable: true,
                                }}
                            >
                                <div className="swiper-wrapper">
                                    {list.map(testimonial =>
                                        <SwiperSlide key={testimonial.id}>
                                            <SingleTestimonialV1 testimonial={testimonial} />
                                        </SwiperSlide>
                                    )}
                                </div>
                                <div className="swiper-pagination"></div>
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestimonialV1;