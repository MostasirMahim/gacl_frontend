"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay } from "swiper/modules";
import Link from "next/link";
import ShopProductTab from "../ShopProductTab";
import RelatedProducts from "../RelatedProducts";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import RatingsStar from "../RatingsStar";
import { toast } from "react-toastify";
import { useRestaurantCartStore } from "@/store/useRestaurantCartStore";
import staticData from "../../assets/staticData.json";

interface ItemDetailType {
  id: number;
  name: string;
  description?: string;
  selling_price: string | number;
  half_price?: string | number;
  sku?: string;
  stock?: number;
  tags?: string[];
  additional_info?: Record<string, string>;
  item_media?: { image: string }[];
  thumb?: string;
}

interface DataType {
  id: number;
  productTag: string[];
  title: string;
  thumb: string;
  newPrice: number;
  oldPrice?: number;
  description?: string;
  sku?: string;
  stock?: string;
}

interface ShopSinglePageContentProps {
  productInfo: any;
  reviews?: any[];
  relatedItems?: any[];
  restaurantSlug?: string;
}

const ShopSinglePageContent = ({
  productInfo,
  reviews,
  relatedItems,
  restaurantSlug,
}: ShopSinglePageContentProps) => {
  // Resolve dynamic vs static mockup fields
  const isDynamic = productInfo.name !== undefined;

  const [quantity, setQuantity] = useState(1);
  const [portion, setPortion] = useState<"full" | "half">("full");
  const addItem = useRestaurantCartStore((state) => state.addItem);

  const title = isDynamic ? productInfo.name : productInfo.title;
  const newPrice = isDynamic
    ? Number(productInfo.selling_price)
    : productInfo.newPrice;
  const oldPrice = isDynamic
    ? productInfo.half_price
      ? Number(productInfo.half_price)
      : undefined
    : productInfo.oldPrice;
  const tags = isDynamic
    ? productInfo.tags || []
    : productInfo.productTag || [];
  const sku = isDynamic
    ? productInfo.sku || "N/A"
    : productInfo.sku || "BE45VGRT";
  const stockStatus = isDynamic
    ? productInfo.stock > 0
      ? "In Stock"
      : "Out of Stock"
    : "In Stock";
  const description = isDynamic
    ? productInfo.description || "No description available."
    : "The Aspire 5 is a compact laptop in a thin case with a metal cover, a high-quality Full HD IPS display and a rich set of interfaces. Thanks to its powerful components, the laptop can handle resource-intensive tasks perfectly and is also suitable for most games.";
  const categoryLinks = staticData.ui.shopSingle.categoryLinks;

  const activePrice =
    isDynamic && portion === "half" && productInfo.half_price
      ? Number(productInfo.half_price)
      : newPrice;

  const newP = Number(activePrice).toFixed(2);
  const oldP = oldPrice?.toFixed(2) ?? "";

  // Calculate overall average rating from dynamic reviews
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + Number(r.rating), 0) /
        reviews.length
      : 0;

  // Resolve images
  const hasMedia =
    isDynamic && productInfo.item_media && productInfo.item_media.length > 0;
  const innerCarouselImages = hasMedia
    ? productInfo.item_media.map((media: any, index: number) => ({
        id: index + 1,
        thumb: getMediaUrl(media.image),
        activeClass: index === 0 ? "active" : "",
        badge: staticData.ui.shopSingle.saleBadge,
      }))
    : staticData.productCarouselData.innerCarousel.map((data) => ({
        ...data,
        thumb: `/assets/img/shop/${data.thumb}`,
      }));

  const outerCarouselImages = hasMedia
    ? productInfo.item_media.map((media: any, index: number) => ({
        id: index + 1,
        thumb: getMediaUrl(media.image),
        activeClass: index === 0 ? "active" : "",
        slideNumber: String(index),
      }))
    : staticData.productCarouselData.outerCarousel.map((data) => ({
        ...data,
        thumb: `/assets/img/shop/${data.thumb}`,
      }));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDynamic) {
      alert(`${title} ${staticData.ui.shopSingle.staticModeAlert}`);
      return;
    }

    if (productInfo.stock <= 0) {
      toast.error("This item is currently out of stock.");
      return;
    }

    const price =
      portion === "half" && productInfo.half_price
        ? Number(productInfo.half_price)
        : Number(productInfo.selling_price);

    const cover_image = hasMedia ? productInfo.item_media[0].image : undefined;

    addItem(
      restaurantSlug || "",
      {
        item_id: productInfo.id,
        name: productInfo.name,
        price,
        portion,
        cover_image,
        sku: productInfo.sku,
      },
      quantity,
    );
    toast.success(`Added ${quantity} x ${title} (${portion} portion) to cart!`);
  };

  return (
    <>
      <div className="validtheme-shop-single-area default-padding">
        <div className="container">
          <div className="product-details">
            <div className="row">
              <div className="col-lg-6">
                <div className="product-thumb">
                  <div
                    id="timeline-carousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner item-box">
                      {innerCarouselImages.map((data: any) => (
                        <div
                          className={`carousel-item product-item ${data.activeClass}`}
                          key={data.id}
                        >
                          <Link
                            href="#"
                            className="item popup-gallery"
                            scroll={false}
                          >
                            <Image
                              src={data.thumb}
                              alt="Thumb"
                              width={450}
                              height={450}
                            />
                          </Link>
                          <span className="onsale theme">{data.badge}</span>
                        </div>
                      ))}
                    </div>
                    <div className="carousel-indicators">
                      <Swiper
                        className="product-gallery-carousel"
                        style={{ width: "100%" }}
                        modules={[Keyboard, Autoplay]}
                        loop={outerCarouselImages.length > 4}
                        slidesPerView={2}
                        spaceBetween={30}
                        autoplay={false}
                        centerInsufficientSlides={true}
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
                        {outerCarouselImages.map((data: any) => (
                          <SwiperSlide key={data.id}>
                            <div
                              className={`item ${data.activeClass}`}
                              data-bs-target="#timeline-carousel"
                              data-bs-slide-to={data.slideNumber}
                              aria-current="true"
                            >
                              <Image
                                src={data.thumb}
                                alt="thumb"
                                width={450}
                                height={450}
                                style={{ width: "100%", height: "auto" }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="single-product-contents">
                  <div className="summary-top-box">
                    <div className="product-tags">
                      {tags &&
                        tags.map((data: string, index: number) => (
                          <Link key={index} href="#" scroll={false}>
                            {data}
                          </Link>
                        ))}
                    </div>
                    <div className="review-count">
                      <div className="rating">
                        <RatingsStar ratings={avgRating} />
                      </div>
                      <span>({reviews ? reviews.length : 0} Review)</span>
                    </div>
                  </div>
                  <h2 className="product-title">{title}</h2>
                  <div
                    className="price"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>${newP}</span>
                    {isDynamic && productInfo?.half_price && (
                      <span
                        style={{
                          fontSize: "13px",
                          fontStyle: "italic",
                          fontWeight: 400,
                          color:
                            portion === "half"
                              ? "var(--color-primary)"
                              : "#888",
                          letterSpacing: "0.01em",
                          lineHeight: 1,
                        }}
                      >
                        &mdash; {portion === "half" ? "Half" : "Full"}
                      </span>
                    )}
                  </div>
                  <div className="product-stock validthemes-in-stock d-flex align-items-center">
                    <span>{stockStatus}</span>
                    {isDynamic && productInfo.half_price && (
                      <button
                        type="button"
                        className="portion-toggle-btn"
                        onClick={() =>
                          setPortion(portion === "full" ? "half" : "full")
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "10px",
                          padding: "0 10px",
                          height: "100%",
                          minHeight: "34px",
                          backgroundColor:
                            portion === "half"
                              ? "var(--color-primary)"
                              : "transparent",
                          color:
                            portion === "half"
                              ? "var(--white)"
                              : "var(--color-primary)",
                          border: "1px solid var(--color-primary)",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition:
                            "background-color 0.25s ease, color 0.25s ease",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "var(--black)";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "var(--white)";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "var(--black)";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor =
                            portion === "half"
                              ? "var(--color-primary)"
                              : "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            portion === "half"
                              ? "var(--white)"
                              : "var(--color-primary)";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "var(--color-primary)";
                        }}
                      >
                        {portion === "half" ? staticData.ui.shopSingle.seeFullLabel : staticData.ui.shopSingle.seeHalfLabel}
                      </button>
                    )}
                  </div>
                  <p>{description}</p>
                  <div className="product-purchase-list">
                    <input
                      type="number"
                      id="quantity"
                      step="1"
                      name="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      placeholder="1"
                      className="form-control"
                      style={{
                        width: "80px",
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    />
                    <Link
                      href="#"
                      className="btn secondary btn-theme btn-sm animation"
                      onClick={handleAddToCart}
                      scroll={false}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      {staticData.ui.shopSingle.orderLabel}
                    </Link>
                    <div className="shop-action">
                      <ul>
                        <li className="wishlist">
                          <Link href="#" scroll={false}>
                            <span>{staticData.ui.shopSingle.wishlistLabel}</span>
                          </Link>
                        </li>
                        <li className="compare">
                          <Link href="#" scroll={false}>
                            <span>{staticData.ui.shopSingle.compareLabel}</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="product-estimate-delivary">
                    <i className="fas fa-box-open"></i>
                    <strong> {staticData.ui.shopSingle.deliveryTitle}</strong>
                    <span>{staticData.ui.shopSingle.deliveryText}</span>
                  </div>
                  <div className="product-meta">
                    <span className="sku">
                      <strong>{staticData.ui.shopSingle.skuLabel}</strong> {sku}
                    </span>
                    <span className="posted-in">
                      <strong>{staticData.ui.shopSingle.categoryLabel}</strong>
                      {isDynamic ? (
                        <Link href="#">
                          {productInfo.category || staticData.ui.shopSingle.generalCategory}
                        </Link>
                      ) : (
                        <>
                          <Link href="#">{categoryLinks[0]}</Link>,
                          <Link href="#">{categoryLinks[1]}</Link>,
                          <Link href="#">{categoryLinks[2]}</Link>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ShopProductTab
            itemId={productInfo.id}
            reviews={reviews}
            additionalInfo={isDynamic ? productInfo.additional_info : undefined}
          />
          <RelatedProducts
            relatedItems={relatedItems}
            restaurantSlug={restaurantSlug}
          />
        </div>
      </div>
    </>
  );
};

export default ShopSinglePageContent;
