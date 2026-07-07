import React from "react";
import FoodCartV4Data from "../assets/jsonData/food/FoodCartV4Data.json";
import SingleFoodMenuTabV3 from "./SingleFoodMenuTabV3";
import { getMediaUrl } from "@/lib/utils";

interface SectionType {
  id: number;
  title: string;
  cover_image: string | null;
  description: string;
  items: any[];
  layout_type: string;
}

interface FoodMenuV4Props {
  sections?: SectionType[];
  restaurantSlug?: string;
}

const FoodMenuV4 = ({ sections, restaurantSlug }: FoodMenuV4Props) => {
  // Filter sections that have default layout (or no layout_type)
  const filteredSections = sections
    ? sections.filter((s) => s.layout_type === "default" || !s.layout_type)
    : [];
  const useDynamic = filteredSections && filteredSections.length > 0;

  const sec1Title = useDynamic ? filteredSections[0].title : "Breakfast";
  const sec1Img =
    useDynamic && filteredSections[0].cover_image
      ? getMediaUrl(filteredSections[0].cover_image)
      : "/assets/img/banner/10.jpg";
  const sec1Items = useDynamic ? filteredSections[0].items : [];

  const sec2Title =
    useDynamic && filteredSections.length > 1
      ? filteredSections[1].title
      : "Lunch";
  const sec2Img =
    useDynamic && filteredSections.length > 1 && filteredSections[1].cover_image
      ? getMediaUrl(filteredSections[1].cover_image)
      : "/assets/img/banner/11.jpg";
  const sec2Items =
    useDynamic && filteredSections.length > 1 ? filteredSections[1].items : [];

  return (
    <>
      <div className="food-menus-area default-padding">
        <div className="container">
          {(!useDynamic ||
            (filteredSections && filteredSections.length > 0)) && (
            <div className="food-menus-item">
              <div className="row">
                <div
                  className="col-lg-5 thumb"
                  style={{ background: `url(${sec1Img})` }}
                >
                  <div className="discount-badge">
                    <strong>Menu</strong> {sec1Title}
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="info">
                    <ul className="meal-type">
                      <li>Half</li>
                      <li>Full</li>
                    </ul>
                    <ul className="meal-items">
                      {useDynamic
                        ? sec1Items.map((item: any) => (
                            <SingleFoodMenuTabV3
                              data={item}
                              restaurantSlug={restaurantSlug}
                              key={item.id}
                            />
                          ))
                        : FoodCartV4Data.slice(0, 1).map((food) => (
                            <React.Fragment key={food.id}>
                              {food.tabContent.slice(0, 1).map((list) => (
                                <React.Fragment key={list.id}>
                                  {list.tabData.map((data) => (
                                    <SingleFoodMenuTabV3
                                      data={data}
                                      key={data.id}
                                    />
                                  ))}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(!useDynamic ||
            (filteredSections && filteredSections.length > 1)) && (
            <div className="food-menus-item">
              <div className="row">
                <div
                  className="col-lg-5 thumb order-lg-last"
                  style={{ background: `url(${sec2Img})` }}
                >
                  <div className="discount-badge">
                    <strong>Menu</strong> {sec2Title}
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="info">
                    <ul className="meal-type">
                      <li>Half</li>
                      <li>Full</li>
                    </ul>
                    <ul className="meal-items">
                      {useDynamic
                        ? sec2Items.map((item: any) => (
                            <SingleFoodMenuTabV3
                              data={item}
                              restaurantSlug={restaurantSlug}
                              key={item.id}
                            />
                          ))
                        : FoodCartV4Data.slice(1, 2).map((food) => (
                            <React.Fragment key={food.id}>
                              {food.tabContent.slice(1, 2).map((list) => (
                                <React.Fragment key={list.id}>
                                  {list.tabData.map((data) => (
                                    <SingleFoodMenuTabV3
                                      data={data}
                                      key={data.id}
                                    />
                                  ))}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FoodMenuV4;
