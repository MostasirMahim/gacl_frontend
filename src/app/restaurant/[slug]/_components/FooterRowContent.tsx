import Link from 'next/link';
import FooterNewsLetter from './FooterNewsLetter';
import staticData from "../assets/staticData.json";

interface FooterConfigType {
    about_us?: {
        text?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
        linkedin?: string;
    };
    explore?: { label: string; link: string }[];
    contact_info?: {
        address?: string;
        phone_1?: string;
        phone_2?: string;
        email?: string;
    };
    newsletter?: {
        text?: string;
    };
}

const FooterRowContent = ({ footerConfig }: { footerConfig?: FooterConfigType }) => {
    const formatExternalLink = (url: string) => {
        if (!url) return "#";
        const trimmed = url.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/") || trimmed.startsWith("#")) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    const aboutText = footerConfig?.about_us?.text || staticData.ui.footerRowContent.aboutText;
    const fbLink = footerConfig?.about_us?.facebook || staticData.ui.footerRowContent.socialLinks.facebook;
    const twitterLink = footerConfig?.about_us?.twitter || staticData.ui.footerRowContent.socialLinks.twitter;
    const youtubeLink = footerConfig?.about_us?.youtube || staticData.ui.footerRowContent.socialLinks.youtube;
    const linkedinLink = footerConfig?.about_us?.linkedin || staticData.ui.footerRowContent.socialLinks.linkedin;

    const exploreLinks = footerConfig?.explore || staticData.ui.footerRowContent.exploreLinks;

    const address = footerConfig?.contact_info?.address || staticData.ui.footerRowContent.address;
    const phone1 = footerConfig?.contact_info?.phone_1 || staticData.ui.footerRowContent.phone1;
    const phone2 = footerConfig?.contact_info?.phone_2 || staticData.ui.footerRowContent.phone2;
    const email = footerConfig?.contact_info?.email || staticData.ui.footerRowContent.email;

    const newsletterText = footerConfig?.newsletter?.text || staticData.ui.footerRowContent.newsletterText;

    return (
        <>
            <div className="row">
                <div className="col-lg-3 col-md-6 footer-item mt-50">
                    <div className="f-item about">
                        <h4 className="widget-title">{staticData.ui.footerRowContent.aboutTitle}</h4>
                        <p>{aboutText}</p>
                        <ul className="footer-social">
                            <li>
                                <a href={formatExternalLink(fbLink)} target='_blank' rel="noreferrer">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                            </li>
                            <li>
                                <a href={formatExternalLink(twitterLink)} target='_blank' rel="noreferrer">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a href={formatExternalLink(youtubeLink)} target='_blank' rel="noreferrer">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </li>
                            <li>
                                <a href={formatExternalLink(linkedinLink)} target='_blank' rel="noreferrer">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mt-50 footer-item pl-50 pl-md-15 pl-xs-15">
                    <div className="f-item link">
                        <h4 className="widget-title">{staticData.ui.footerRowContent.exploreTitle}</h4>
                        <ul>
                            {exploreLinks.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.link}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 footer-item  mt-50">
                    <div className="f-item contact">
                        <h4 className="widget-title">{staticData.ui.footerRowContent.contactTitle}</h4>
                        <ul>
                            <li>
                                <div className="icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div className="content">
                                    {address}
                                </div>
                            </li>
                            <li>
                                <div className="icon">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div className="content">
                                    <a href={`tel:${phone1}`}>{phone1}</a>
                                    {phone2 && (
                                        <>
                                            <br />
                                            <a href={`tel:${phone2}`}>{phone2}</a>
                                        </>
                                    )}
                                </div>
                            </li>
                            <li>
                                <div className="icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="content">
                                    <a href={`mailto:${email}`}>{email}</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 footer-item mt-50">
                        <h4 className="widget-title">{staticData.ui.footerRowContent.newsletterTitle}</h4>
                    <p>{newsletterText}</p>
                    <FooterNewsLetter />
                </div>
            </div>
        </>
    );
};

export default FooterRowContent;
