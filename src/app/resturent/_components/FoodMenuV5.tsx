import SingleFoodMenuTabV3 from './SingleFoodMenuTabV3';
import FoodCartV4Data from '../assets/jsonData/food/FoodCartV4Data.json';
import React from 'react';

const FoodMenuV5 = () => {
    return (
        <>
            <div className="food-type-area default-padding">
                <div className="container">
                    <div className="row">

                        <div className="col-lg-6 pr-50 pr-md-15 pr-xs-15 mb-md-50 mb-xs-30">
                            <div className="info">
                                <div className="heading text-center">
                                    <h4 className="sub-title">Fresh from ocean</h4>
                                    <h2 className="title">Sea Food</h2>
                                </div>
                                <ul className="meal-type">
                                    <li>Half</li>
                                    <li>Full</li>
                                </ul>
                                <ul className="meal-items">
                                    {FoodCartV4Data.slice(2, 3).map(food =>
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

                        <div className="col-lg-6 pl-50 pl-md-15 pl-xs-15">
                            <div className="meal-thumb-less">
                                <div className="info">
                                    <div className="heading text-center">
                                        <h4 className="sub-title">Drinks & Wine</h4>
                                        <h2 className="title">Beverage</h2>
                                    </div>
                                    <ul className="meal-type">
                                        <li>Half</li>
                                        <li>Full</li>
                                    </ul>
                                    <ul className="meal-items">
                                        {FoodCartV4Data.slice(3, 4).map(food =>
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
                </div>
            </div>
        </>
    );
};

export default FoodMenuV5;