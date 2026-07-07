import React from 'react';
import FoodCartV4Data from '../assets/jsonData/food/FoodCartV4Data.json'
import SingleFoodMenuTabV3 from './SingleFoodMenuTabV3';

const FoodMenuV4 = () => {
    return (
        <>
            <div className="food-menus-area default-padding">
                <div className="container">
                    <div className="food-menus-item">
                        <div className="row">
                            <div className="col-lg-5 thumb" style={{ background: "url(/assets/img/banner/10.jpg)" }}>
                                <div className="discount-badge">
                                    <strong>Menu</strong> Breakfast
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="info">
                                    <ul className="meal-type">
                                        <li>Half</li>
                                        <li>Full</li>
                                    </ul>
                                    <ul className="meal-items">
                                        {FoodCartV4Data.slice(0, 1).map(food =>
                                            <React.Fragment key={food.id}>
                                                {
                                                    food.tabContent.slice(0, 1).map(list =>
                                                        <React.Fragment key={list.id}>
                                                            {
                                                                list.tabData.map(data =>
                                                                    <SingleFoodMenuTabV3 data={data} key={data.id} />
                                                                )
                                                            }
                                                        </React.Fragment>
                                                    )
                                                }
                                            </React.Fragment>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="food-menus-item">
                        <div className="row">
                            <div className="col-lg-5 thumb order-lg-last"
                                style={{ background: "url(/assets/img/banner/11.jpg)" }}>
                                <div className="discount-badge">
                                    <strong>Menu</strong> Lunch
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="info">
                                    <ul className="meal-type">
                                        <li>Half</li>
                                        <li>Full</li>
                                    </ul>
                                    <ul className="meal-items">
                                        {FoodCartV4Data.slice(1, 2).map(food =>
                                            <React.Fragment key={food.id}>
                                                {
                                                    food.tabContent.slice(1, 2).map(list =>
                                                        <React.Fragment key={list.id}>
                                                            {
                                                                list.tabData.map(data =>
                                                                    <SingleFoodMenuTabV3 data={data} key={data.id} />
                                                                )
                                                            }
                                                        </React.Fragment>
                                                    )
                                                }
                                            </React.Fragment>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FoodMenuV4;