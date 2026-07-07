import HeaderTopV1 from "./HeaderTopV1";
import FooterV1 from "./FooterV1";
import HeaderV6 from "./HeaderV6";
import BreadCrumb from "./BreadCrumb";

interface DataType {
  children: React.ReactNode;
  breadCrumb?: string;
  title?: string;
  logoWhite?: boolean;
  bgImage?: string;
  homePath?: string;
  footerConfig?: any;
}

const LayoutV6 = ({ children, breadCrumb, title, logoWhite, bgImage, homePath, footerConfig }: DataType) => {
  return (
    <>
      <div className="wrapper">
        <HeaderTopV1 />
        {/* <HeaderV6 logoWhite={logoWhite} /> */}
        {breadCrumb && <BreadCrumb breadCrumb={breadCrumb} title={title} bgImage={bgImage} homePath={homePath} />}
        {children}
        <FooterV1 footerConfig={footerConfig} />
      </div>
    </>
  );
};

export default LayoutV6;
