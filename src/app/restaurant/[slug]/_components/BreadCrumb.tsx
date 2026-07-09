import Link from 'next/link';
import { getMediaUrl } from '@/lib/utils';
import staticData from "../assets/staticData.json";

interface DataType {
    breadCrumb?: string;
    title?: string;
    bgImage?: string;
    homePath?: string;
}

const BreadCrumb = ({ breadCrumb, title, bgImage, homePath }: DataType) => {
    const bg = bgImage ? getMediaUrl(bgImage) : staticData.ui.menuPage.defaultBgImage;
    const home = homePath ? homePath : staticData.ui.breadcrumb.defaultHomePath;

    return (
        <>
            <div className="breadcrumb-area bg-cover shadow dark text-center text-light"
                style={{ backgroundImage: `url(${bg})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <h1>{title ? title : staticData.ui.breadcrumb.defaultTitle}</h1>
                            <ul className="breadcrumb">
                                <li><Link href={home}><i className="fas fa-home"></i> Home</Link></li>
                                <li>{breadCrumb ? breadCrumb : staticData.ui.breadcrumb.defaultCrumb}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BreadCrumb;
