import Link from 'next/link';
import FooterRowContent from './FooterRowContent';
import Image from 'next/image';

const FooterV1 = ({ footerConfig }: { footerConfig?: any }) => {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="footer-style-one bg-dark text-light">
                        <FooterRowContent footerConfig={footerConfig} />
                    </div>
                </div>

                <div className="footer-bottom text-light">
                    <div className="footer-bottom-shape">
                        <Image src="/assets/img/shape/9.png" alt="Image Not Found" width={616} height={800} />
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="footer-logo">
                                    <Link href="/resturent/food-menu">
                                        <Image src="/assets/img/logo-light.png" alt="Logo" width={675} height={332} />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-6 text-end">
                                <p>
                                    &copy; Copyright {(new Date().getFullYear())}. Restan. All Rights Reserved
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterV1;
