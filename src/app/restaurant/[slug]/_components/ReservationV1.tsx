import ReservationForm from './ReservationForm';
import staticData from "../assets/staticData.json";

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
    const title = restaurant?.reservation_banner_title || staticData.ui.reservationV1.title;
    const text = restaurant?.reservation_banner_text || staticData.ui.reservationV1.text;
    const lunchStats = restaurant?.reservation_banner_launch_menu || staticData.ui.reservationV1.lunchStats;
    const dinnerStats = restaurant?.reservation_banner_dinner_menu || staticData.ui.reservationV1.dinnerStats;

    return (
        <>
            <div className={`reservation-area default-padding-top bg-cover shadow dark ${sectionClass}`}
                style={{ backgroundImage: `url(${staticData.ui.reservationV1.bgImage})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="reservation-info text-light">
                                <h4 className="sub-heading">{staticData.ui.reservationV1.subHeading}</h4>
                                <h2 className="title">{title}</h2>
                                <p>
                                    {text}
                                </p>
                                <div className="reservation-time">
                                    <ul>
                                        <li>
                                            <h4>{staticData.ui.reservationV1.lunchLabel}</h4>
                                            <p>
                                                {lunchStats}
                                            </p>
                                        </li>
                                        <li>
                                            <h4>{staticData.ui.reservationV1.dinnerLabel}</h4>
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