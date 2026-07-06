import Link from 'next/link';
import SocialShare from './SocialShare';
import FooterNewsLetter from './FooterNewsLetter';

const FooterRowContent = () => {
    return (
        <>
            <div className="row">
                <div className="col-lg-3 col-md-6 footer-item mt-50">
                    <div className="f-item about">
                        <h4 className="widget-title">About Us</h4>
                        <p>
                            Continued at zealously necessary is Surrounded sir motionless she end literature. Gay direction neglected.
                        </p>
                        <ul className="footer-social">
                            <SocialShare />
                        </ul>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mt-50 footer-item pl-50 pl-md-15 pl-xs-15">
                    <div className="f-item link">
                        <h4 className="widget-title">Explore</h4>
                        <ul>
                            <li>
                                <Link href="/resturent/food-menu">Menu</Link>
                            </li>
                            <li>
                                <Link href="#">About</Link>
                            </li>
                            <li>
                                <Link href="#">Help Center</Link>
                            </li>
                            <li>
                                <Link href="#">Career</Link>
                            </li>
                            <li>
                                <Link href="#">Features</Link>
                            </li>
                            <li>
                                <Link href="#">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 footer-item  mt-50">
                    <div className="f-item contact">
                        <h4 className="widget-title">Contact Info</h4>
                        <ul>
                            <li>
                                <div className="icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div className="content">
                                    175 10h Street, Office 375 Berlin, De 21562
                                </div>
                            </li>
                            <li>
                                <div className="icon">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div className="content">
                                    <a href="tel:2151234567">+123 34598768</a> <br /> <a href="tel:2151234567">+554 34598734</a>
                                </div>
                            </li>
                            <li>
                                <div className="icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="content">
                                    <a href="mailto:name@email.com">food@restan.com</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 footer-item mt-50">
                    <h4 className="widget-title">Newsletter</h4>
                    <p>
                        Join our subscribers list to get the latest news and special offers.
                    </p>
                    <FooterNewsLetter />
                </div>
            </div>
        </>
    );
};

export default FooterRowContent;
