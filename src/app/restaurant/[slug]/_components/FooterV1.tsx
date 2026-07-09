import Link from 'next/link';
import FooterRowContent from './FooterRowContent';
import Image from 'next/image';
import staticData from "../assets/staticData.json";

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
                        <Image src={staticData.ui.footer.shapeImage} alt="Image Not Found" width={616} height={800} />
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="footer-logo">
                                    <Link href={staticData.ui.footer.logoLink}>
                                        <Image src={staticData.ui.footer.logoImage} alt="Logo" width={675} height={332} />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-lg-6 text-end">
                                    <p>
                                    &copy; Copyright {(new Date().getFullYear())}. {staticData.ui.footer.brandName}. {staticData.ui.footer.rightsText}
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
