import Link from 'next/link';
import Image from 'next/image';

const DeliveryV1 = () => {
    return (
        <>
            <div className="deliverya-process-area shadow dark default-padding bg-dark text-light bg-cover"
                style={{ backgroundImage: "url(/assets/img/banner/9.jpg)" }}>
                <div className="shape">
                    <Image src="/assets/img/illustration/11.png" alt="Image Not Found" width={697} height={822} />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5 col-lg-8">
                            <div className="delivary-projcess">
                                <h2>30 Minutes Delivery!</h2>
                                <p>
                                    A relaxing and pleasant atmosphere, good jazz, dinner, and cocktails. The Patio Time Bar opens in the center of Florence. The only bar inspired by the 1960s, it will give you a experience that you’ll have a hard time forgetting.
                                </p>
                                <Link className="btn btn-theme btn-md animation mt-10" href="/shop">Order Now <i className="far fa-shopping-cart"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliveryV1;