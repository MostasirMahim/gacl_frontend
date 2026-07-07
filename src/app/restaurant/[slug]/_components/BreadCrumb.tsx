import Link from 'next/link';
import { getMediaUrl } from '@/lib/utils';

interface DataType {
    breadCrumb?: string;
    title?: string;
    bgImage?: string;
    homePath?: string;
}

const BreadCrumb = ({ breadCrumb, title, bgImage, homePath }: DataType) => {
    const bg = bgImage ? getMediaUrl(bgImage) : "/assets/img/shape/5.jpg";
    const home = homePath ? homePath : "/restaurant";

    return (
        <>
            <div className="breadcrumb-area bg-cover shadow dark text-center text-light"
                style={{ backgroundImage: `url(${bg})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <h1>{title ? title : "Error Page"}</h1>
                            <ul className="breadcrumb">
                                <li><Link href={home}><i className="fas fa-home"></i> Home</Link></li>
                                <li>{breadCrumb ? breadCrumb : "not-found"}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BreadCrumb;
