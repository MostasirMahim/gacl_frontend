import SocialShare from './SocialShare';
import Link from 'next/link';
import Image from 'next/image';
import staticData from "../assets/staticData.json";

interface DataType {
    sectionClass?: string;
}

const HeaderTopV1 = ({ sectionClass }: DataType) => {
    return (
        <>
            <div className={`top-bar-area top-bar-style-one bg-theme text-light ${sectionClass}`}>
                <div className="container">
                    <div className="row align-center">
                        <div className="col-lg-7">
                            <ul className="item-flex">
                                <li>
                                    <a href="tel:+4733378901" className="d-flex align-items-center">
                                        <Image src="/assets/img/icon/6.png" alt="Icon" width={64} height={64} style={{ height: '23px', width: 'auto', marginRight: '5px' }} /> {staticData.ui.headerTopV1.phoneLabel} {staticData.ui.headerTopV1.phone}
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:name@email.com" className="d-flex align-items-center">
                                        <Image src="/assets/img/icon/7.png" alt="Icon" width={64} height={64} style={{ height: '23px', width: 'auto', marginRight: '5px' }} /> {staticData.ui.headerTopV1.emailLabel} {staticData.ui.headerTopV1.email}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-5 text-end">
                            <div className="item-flex">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <Image src="/assets/img/icon/flag.png" alt="Image Not Found" width={50} height={50} style={{ height: '20px', width: 'auto', marginRight: '5px', display: 'inline-block', verticalAlign: 'middle' }} />
                                        {staticData.ui.headerTopV1.language} <i className="fas fa-angle-down"></i>
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li><Link className="dropdown-item" href="#">{staticData.ui.headerTopV1.languages[0]}</Link></li>
                                        <li><Link className="dropdown-item" href="#">{staticData.ui.headerTopV1.languages[1]}</Link></li>
                                    </ul>
                                </div>
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
        </>
    );
};

export default HeaderTopV1;
