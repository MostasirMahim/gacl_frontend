import ReservationForm from './ReservationForm';

interface RestaurantType {
    reservation_banner_title?: string;
    reservation_banner_text?: string;
    reservation_banner_launch_menu?: string;
    reservation_banner_dinner_menu?: string;
}

interface DataType {
    btnClass?: string;
    sectionClass?: string;
    restaurant?: RestaurantType;
}

const ReservationV1 = ({ btnClass, sectionClass, restaurant }: DataType) => {
    const title = restaurant?.reservation_banner_title || "Reservation Your Favorite Private Table";
    const text = restaurant?.reservation_banner_text || "A relaxing and pleasant atmosphere, good jazz, dinner, and cocktails. The Patio Time Bar opens in the center of Florence. The only bar inspired by the 1960s, it will give you a experience that you’ll have a hard time forgetting.";
    const lunchStats = restaurant?.reservation_banner_launch_menu || "30+ items";
    const dinnerStats = restaurant?.reservation_banner_dinner_menu || "50+ items";

    return (
        <>
            <div className={`reservation-area default-padding-top bg-cover shadow dark ${sectionClass}`}
                style={{ backgroundImage: 'url(/assets/img/banner/2.jpg)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="reservation-info text-light">
                                <h4 className="sub-heading">Reservation</h4>
                                <h2 className="title">{title}</h2>
                                <p>
                                    {text}
                                </p>
                                <div className="reservation-time">
                                    <ul>
                                        <li>
                                            <h4>Launch Menu</h4>
                                            <p>
                                                {lunchStats}
                                            </p>
                                        </li>
                                        <li>
                                            <h4>Dinner Menu</h4>
                                            <p>
                                                {dinnerStats}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            <div className="reservation-form animate" data-aos="fade-up" data-aos-delay="300">
                                <ReservationForm btnClass={btnClass} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReservationV1;