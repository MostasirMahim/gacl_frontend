"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Autoplay } from 'swiper/modules';
import ProductCarouselData from '../../assets/jsonData/product/ProductCarouselData.json'
import Link from 'next/link';
import ShopProductTab from '../ShopProductTab';
import RelatedProducts from '../RelatedProducts';
import Image from 'next/image';

interface DataType {
    id: number;
    productTag: string[];
    title: string;
    thumb: string;
    newPrice: number;
    oldPrice?: number;
}

const ShopSinglePageContent = ({ productInfo }: { productInfo: DataType }) => {
    const { productTag, title, newPrice, oldPrice } = productInfo;

    const newP = (Math.floor(newPrice)).toFixed(2);
    const oldP = oldPrice?.toFixed(2) ?? '';

    const handleAddToCart = () => {
        alert(`${title} added to cart! (Static Mode)`);
    };

    return (
        <>
            <div className="validtheme-shop-single-area default-padding">
                <div className="container">
                    <div className="product-details">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="product-thumb">
                                    <div id="timeline-carousel" className="carousel slide" data-bs-ride="carousel">
                                        <div className="carousel-inner item-box">
                                            {ProductCarouselData.innerCarousel.map(data =>
                                                <div className={`carousel-item product-item ${data.activeClass}`} key={data.id}>
                                                    <Link href="#" className="item popup-gallery" scroll={false}>
                                                        <Image src={`/assets/img/shop/${data.thumb}`} alt="Thumb" width={450} height={450} />
                                                    </Link>
                                                    <span className="onsale theme">{data.badge}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="carousel-indicators">
                                            <Swiper className="product-gallery-carousel"
                                                modules={[Keyboard, Autoplay]}
                                                loop={true}
                                                slidesPerView={2}
                                                spaceBetween={30}
                                                autoplay={false}
                                                breakpoints={{
                                                    768: {
                                                        slidesPerView: 3,
                                                    },
                                                    992: {
                                                        slidesPerView: 3,
                                                    },
                                                    1200: {
                                                        slidesPerView: 4,
                                                    },
                                                }}
                                            >
                                                {ProductCarouselData.outerCarousel.map(data =>
                                                    <SwiperSlide key={data.id}>
                                                        <div className={`item ${data.activeClass}`} data-bs-target="#timeline-carousel" data-bs-slide-to={data.slideNumber} aria-current="true">
                                                            <Image src={`/assets/img/shop/${data.thumb}`} alt="thumb" width={450} height={450} />
                                                        </div>
                                                    </SwiperSlide>
                                                )}
                                            </Swiper>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="single-product-contents">
                                    <div className="summary-top-box">
                                        <div className="product-tags">
                                            {productTag && productTag.map((data, index) =>
                                                <Link key={index} href="#" scroll={false}>
                                                    {data}
                                                </Link>
                                            )}
                                        </div>
                                        <div className="review-count">
                                            <div className="rating">
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star"></i>
                                                <i className="fas fa-star-half-alt"></i>
                                            </div>
                                            <span>(8 Review)</span>
                                        </div>
                                    </div>
                                    <h2 className="product-title">
                                        {title}
                                    </h2>
                                    <div className="price">
                                        <span className={oldPrice ? '' : 'd-none'}>
                                            <del>${oldPrice ? oldP : ''}</del>
                                        </span>
                                        <span className='ms-2'>${newP}</span>
                                    </div>
                                    <div className="product-stock validthemes-in-stock">
                                        <span>In Stock</span>
                                    </div>
                                    <p>
                                        The Aspire 5 is a compact laptop in a thin case with a metal cover, a high-quality Full HD IPS display and a rich set of interfaces. Thanks to its powerful components, the laptop can handle resource-intensive tasks perfectly and is also suitable for most games. non-characteristic words etc. Susp endisse ultricies nisi vel quam suscipit. Sabertooth peacock flounder
                                    </p>
                                    <div className="product-purchase-list">
                                        <input type="number" id="quantity" step="1" name="quantity" min="0" placeholder="0" />
                                        <Link href="#" className="btn secondary btn-theme btn-sm animation" onClick={handleAddToCart} scroll={false}>
                                            <i className="fas fa-shopping-cart"></i>
                                            Add to cart
                                        </Link>
                                        <div className="shop-action">
                                            <ul>
                                                <li className="wishlist">
                                                    <Link href="#" scroll={false}><span>Add to wishlist</span></Link>
                                                </li>
                                                <li className="compare">
                                                    <Link href="#" scroll={false}><span>Compare</span></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="product-estimate-delivary">
                                        <i className="fas fa-box-open"></i>
                                        <strong> 2-day Delivery</strong>
                                        <span>Speedy and reliable parcel delivery!</span>
                                    </div>
                                    <div className="product-meta">
                                        <span className="sku">
                                            <strong>SKU:</strong> BE45VGRT
                                        </span>
                                        <span className="posted-in">
                                            <strong>Category:</strong>
                                            <Link href="#">Computer</Link>,
                                            <Link href="#">Speaker</Link>,
                                            <Link href="#">Headphone</Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ShopProductTab />
                    <RelatedProducts />
                </div>
            </div >
        </>
    );
};

export default ShopSinglePageContent;