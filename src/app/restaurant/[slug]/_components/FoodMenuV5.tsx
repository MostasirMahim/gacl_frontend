import SingleFoodMenuTabV3 from "./SingleFoodMenuTabV3";
import FoodCartV4Data from "../assets/jsonData/food/FoodCartV4Data.json";
import React from "react";

interface SectionType {
  id: number;
  title: string;
  cover_image: string | null;
  description: string;
  items: any[];
  layout_type: string;
}

interface FoodMenuV5Props {
  sections?: SectionType[];
  restaurantSlug?: string;
}

const FoodMenuV5 = ({ sections, restaurantSlug }: FoodMenuV5Props) => {
  const hasLayoutField =
    sections &&
    sections.length > 0 &&
    sections.some((s) => s.layout_type !== undefined);

  if (hasLayoutField) {
    const leftSections = sections
      ? sections.filter((s) => s.layout_type === "left")
      : [];
    const rightSections = sections
      ? sections.filter((s) => s.layout_type === "right")
      : [];
    const maxPairs = Math.max(leftSections.length, rightSections.length);

    if (maxPairs === 0) return null;

    return (
      <>
        {Array.from({ length: maxPairs }).map((_, i) => {
          const leftSec = leftSections[i];
          const rightSec = rightSections[i];

          return (
            <div className="food-type-area default-padding" key={i}>
              <div className="container">
                <div className="row">
                  {leftSec && (
                    <div className="col-lg-6 pr-50 pr-md-15 pr-xs-15 mb-md-50 mb-xs-30">
                      <div className="info">
                        <div className="heading text-center">
                          <h4 className="sub-title">{leftSec.description}</h4>
                          <h2 className="title">{leftSec.title}</h2>
                        </div>
                        <ul className="meal-type">
                          <li>Half</li>
                          <li>Full</li>
                        </ul>
                        <ul className="meal-items">
                          {leftSec.items?.map((item: any) => (
                            <SingleFoodMenuTabV3
                              data={item}
                              restaurantSlug={restaurantSlug}
                              key={item.id}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {rightSec && (
                    <div className="col-lg-6 pl-50 pl-md-15 pl-xs-15">
                      <div className="meal-thumb-less">
                        <div className="info">
                          <div className="heading text-center">
                            <h4 className="sub-title">
                              {rightSec.description}
                            </h4>
                            <h2 className="title">{rightSec.title}</h2>
                          </div>
                          <ul className="meal-type">
                            <li>Half</li>
                            <li>Full</li>
                          </ul>
                          <ul className="meal-items">
                            {rightSec.items?.map((item: any) => (
                              <SingleFoodMenuTabV3
                                data={item}
                                restaurantSlug={restaurantSlug}
                                key={item.id}
                              />
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  // Fallback static design
  const useDynamic = sections && sections.length > 2;

  const sec3Title = useDynamic ? sections[2].title : "Sea Food";
  const sec3Sub = useDynamic ? sections[2].description : "Fresh from ocean";
  const sec3Items = useDynamic ? sections[2].items : [];

  const sec4Title =
    useDynamic && sections.length > 3 ? sections[3].title : "Beverage";
  const sec4Sub =
    useDynamic && sections.length > 3
      ? sections[3].description
      : "Drinks & Wine";
  const sec4Items = useDynamic && sections.length > 3 ? sections[3].items : [];

  return (
    <>
      <div className="food-type-area default-padding">
        <div className="container">
          <div className="row">
            {(!useDynamic || (sections && sections.length > 2)) && (
              <div className="col-lg-6 pr-50 pr-md-15 pr-xs-15 mb-md-50 mb-xs-30">
                <div className="info">
                  <div className="heading text-center">
                    <h4 className="sub-title">{sec3Sub}</h4>
                    <h2 className="title">{sec3Title}</h2>
                  </div>
                  <ul className="meal-type">
                    <li>Half</li>
                    <li>Full</li>
                  </ul>
                  <ul className="meal-items">
                    {useDynamic
                      ? sec3Items.map((item: any) => (
                          <SingleFoodMenuTabV3
                            data={item}
                            restaurantSlug={restaurantSlug}
                            key={item.id}
                          />
                        ))
                      : FoodCartV4Data.slice(2, 3).map((food) => (
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
            )}

            {(!useDynamic || (sections && sections.length > 3)) && (
              <div className="col-lg-6 pl-50 pl-md-15 pl-xs-15">
                <div className="meal-thumb-less">
                  <div className="info">
                    <div className="heading text-center">
                      <h4 className="sub-title">{sec4Sub}</h4>
                      <h2 className="title">{sec4Title}</h2>
                    </div>
                    <ul className="meal-type">
                      <li>Half</li>
                      <li>Full</li>
                    </ul>
                    <ul className="meal-items">
                      {useDynamic
                        ? sec4Items.map((item: any) => (
                            <SingleFoodMenuTabV3
                              data={item}
                              restaurantSlug={restaurantSlug}
                              key={item.id}
                            />
                          ))
                        : FoodCartV4Data.slice(3, 4).map((food) => (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodMenuV5;
