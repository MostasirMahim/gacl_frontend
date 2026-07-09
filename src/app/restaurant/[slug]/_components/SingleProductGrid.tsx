import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import { useRestaurantCartStore } from "@/store/useRestaurantCartStore";
import { toast } from "react-toastify";
import staticData from "../assets/staticData.json";

interface DataType {
  id: number;
  slug?: string;
  thumb?: string;
  cover_image?: string;
  item_media?: { image: string }[];
  badge?: string;
  title?: string;
  name?: string;
  newPrice?: number;
  selling_price?: string | number;
  oldPrice?: number;
  half_price?: string | number;
  btnText?: string;
  productTag?: string[];
  tags?: string[];
}

const SingleProductGrid = ({
  product,
  restaurantSlug,
}: {
  product: DataType;
  restaurantSlug?: string;
}) => {
  const {
    id,
    slug,
    thumb,
    cover_image,
    item_media,
    badge,
    title,
    name,
    newPrice,
    selling_price,
    oldPrice,
    half_price,
    btnText,
    productTag,
    tags,
  } = product;

  const addItem = useRestaurantCartStore((state) => state.addItem);

  const displayTitle = name || title || staticData.ui.singleProductGrid.defaultTitle;
  const displayNewPrice =
    selling_price !== undefined && selling_price !== null
      ? Number(selling_price)
      : newPrice || 0;
  const displayOldPrice =
    half_price !== undefined && half_price !== null
      ? Number(half_price)
      : oldPrice;
  const displayTags = tags || productTag || [];
  const displayBtnText = btnText || staticData.ui.singleProductGrid.defaultBtnText;

  const newP = Math.floor(displayNewPrice).toFixed(2);
  const oldP = displayOldPrice?.toFixed(2) ?? "";

  let imageSrc = staticData.ui.singleProductGrid.defaultImage;
  if (cover_image) {
    imageSrc = getMediaUrl(cover_image);
  } else if (item_media && item_media.length > 0) {
    imageSrc = getMediaUrl(item_media[0].image);
  } else if (thumb) {
    imageSrc =
      thumb.startsWith("/media") || thumb.startsWith("http")
        ? getMediaUrl(thumb)
        : `/assets/restaurent_images/shop/${thumb}`;
  }

  const itemDetailLink =
    restaurantSlug && slug
      ? `/restaurant/${restaurantSlug}/items/${slug}`
      : `/restaurant/shop-single/${id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!restaurantSlug) {
      toast.error(staticData.ui.singleProductGrid.restaurantContextMissing);
      return;
    }

    addItem(
      restaurantSlug,
      {
        item_id: id,
        name: displayTitle,
        price: displayNewPrice,
        portion: "full",
        cover_image:
          cover_image ||
          (item_media && item_media.length > 0 ? item_media[0].image : thumb) ||
          undefined,
        sku: slug || String(id),
      },
      1,
    );

    toast.success(`${displayTitle} ${staticData.ui.singleProductGrid.toastSuffix}`);
  };

  return (
    <>
      <li className="product col-12">
        <div className="product-contents">
          <div className="product-image">
            {badge && <span className="onsale">{badge}</span>}
            <Link href={itemDetailLink}>
              <Image src={imageSrc} alt="Product" width={450} height={450} />
            </Link>
            <div className="shop-action">
              <ul>
                <li className="wishlist">
                  <Link href="#" scroll={false}>
                    <span>{staticData.ui.singleProductGrid.wishlistLabel}</span>
                  </Link>
                </li>
                <li className="quick-view">
                  <Link href="#" scroll={false}>
                    <span>{staticData.ui.singleProductGrid.quickViewLabel}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="product-caption">
            <div className="product-tags">
              {displayTags.map((data, index) => (
                <Link href="#" key={index}>
                  {data}
                </Link>
              ))}
            </div>
            <h4 className="product-title">
              <Link href={itemDetailLink}>{displayTitle}</Link>
            </h4>
            <div className="price">
              <span className={displayOldPrice ? "" : "d-none"}>
                <del>${displayOldPrice ? oldP : ""}</del>
              </span>
              <span className="ms-2">${newP}</span>
            </div>
            <Link
              href="#"
              className="cart-btn"
              scroll={false}
              onClick={handleAddToCart}
            >
              <i className="fas fa-shopping-bag"></i>
              {displayBtnText}
            </Link>
          </div>
        </div>
      </li>
    </>
  );
};

export default SingleProductGrid;
