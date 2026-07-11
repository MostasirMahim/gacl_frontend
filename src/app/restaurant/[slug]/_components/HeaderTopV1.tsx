import SocialShare from './SocialShare';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import staticData from "../assets/staticData.json";

interface DataType {
    sectionClass?: string;
}

const HeaderTopV1 = ({ sectionClass }: DataType) => {
    return (
        <div className={`top-bar-area top-bar-style-one bg-theme text-light ${sectionClass ?? ""}`}>
            <div className="container">
                <div className="row align-center">

                    {/* Left — contact info */}
                    <div className="col-lg-7">
                        <ul className="item-flex">
                            <li>
                                <a href={`tel:${staticData.ui.headerTopV1.phone}`} className="d-flex align-items-center">
                                    <Image
                                        src="/assets/img/icon/6.png"
                                        alt="Phone"
                                        width={64}
                                        height={64}
                                        style={{ height: "23px", width: "auto", marginRight: "5px" }}
                                    />
                                    {staticData.ui.headerTopV1.phoneLabel}&nbsp;{staticData.ui.headerTopV1.phone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${staticData.ui.headerTopV1.email}`} className="d-flex align-items-center">
                                    <Image
                                        src="/assets/img/icon/7.png"
                                        alt="Email"
                                        width={64}
                                        height={64}
                                        style={{ height: "23px", width: "auto", marginRight: "5px" }}
                                    />
                                    {staticData.ui.headerTopV1.emailLabel}&nbsp;{staticData.ui.headerTopV1.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Right — theme toggle + social */}
                    <div className="col-lg-5 text-end">
                        <div className="item-flex" style={{ justifyContent: "flex-end", gap: "12px" }}>

                            {/* Theme toggle (replaces language dropdown) */}
                            <div className="d-flex align-items-center">
                                <ThemeToggle />
                            </div>

                            {/* Social icons */}
                            <div className="social">
                                <ul>
                                    <SocialShare />
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HeaderTopV1;
