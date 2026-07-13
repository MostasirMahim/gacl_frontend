import Link from "next/link";
import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";
import staticData from "../assets/staticData.json";

interface DataType {
  id: number;
  slug?: string;
  thumb?: string;
  cover_image?: string;
  item_media?: { image: string }[];
  name: string;
  price?: number;
  half_price?: number | string;
  priceFull?: number;
  selling_price?: number | string;
  leftInfo?: string;
  sub_items?: string;
  rightInfo?: string;
  free_bonus?: string;
}

const SingleFoodMenuTabV3 = ({
  data,
  restaurantSlug,
}: {
  data: DataType;
  restaurantSlug?: string;
}) => {
  const {
    id,
    slug,
    thumb,
    cover_image,
    item_media,
    name,
    price,
    half_price,
    priceFull,
    selling_price,
    leftInfo,
    sub_items,
    rightInfo,
    free_bonus,
  } = data;

  const displayPrice =
    half_price !== undefined && half_price !== null ? half_price : price;
  const displayPriceFull =
    selling_price !== undefined && selling_price !== null
      ? selling_price
      : priceFull;
  const displaySub =
    sub_items !== undefined && sub_items !== null ? sub_items : leftInfo;
  const displayBonus =
    free_bonus !== undefined && free_bonus !== null ? free_bonus : rightInfo;

  let imageSrc = staticData.ui.singleFoodMenuTabV3.defaultImage;
  if (cover_image) {
    imageSrc = getMediaUrl(cover_image);
  } else if (item_media && item_media.length > 0) {
    imageSrc = getMediaUrl(item_media[0].image);
  } else if (thumb) {
    imageSrc =
      thumb.startsWith("/media") || thumb.startsWith("http")
        ? getMediaUrl(thumb)
        : `/assets/restaurent_images/food/${thumb}`;
  }

  const itemDetailLink =
    restaurantSlug && slug
      ? `/restaurant/${restaurantSlug}/items/${slug}`
      : `${staticData.ui.singleFoodMenuTabV3.staticRoutePrefix}${id}`;

  return (
    <>
      <li>
        <div className="thumbnail">
          <Image
            src={imageSrc}
            alt="Image Not Found"
            width={200}
            height={200}
            style={{
              objectFit: "cover",
              aspectRatio: "1/1",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        </div>
        <div className="content">
          <div className="top">
            <div className="title">
              <h4>
                <Link href={itemDetailLink}>{name}</Link>
              </h4>
            </div>
            <div className="price">
              {displayPrice !== undefined && displayPrice !== null && (
                <span>${displayPrice}</span>
              )}
              {displayPriceFull !== undefined && displayPriceFull !== null && (
                <span>${displayPriceFull}</span>
              )}
            </div>
          </div>
          <div className="bottom">
            <div className="left">
              <p>{displaySub}</p>
            </div>
            <div className="right">
              <p>{displayBonus}</p>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default SingleFoodMenuTabV3;
