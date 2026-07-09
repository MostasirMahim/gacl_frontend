import Link from 'next/link';
import Image from 'next/image';
import staticData from "../assets/staticData.json";

interface DataType {
    id: number;
    thumb: string;
    badge?: string;
    title: string;
    newPrice: number;
    oldPrice?: number;
    btnText: string;
    productTag: string[];
}

const SingleProductList = ({ product }: { product: DataType }) => {
    const { id, thumb, badge, title, newPrice, oldPrice, btnText, productTag } = product

    const newP = (Math.floor(newPrice)).toFixed(2);
    const oldP = oldPrice?.toFixed(2) ?? '';

    const handleAddToCart = () => {
        alert(`${title} ${staticData.ui.singleProductList.staticModeAlert}`);
    };

    return (
        <>
            <li className="product">
                <div className="product-contents">
                    <div className="row align-center">
                        <div className="col-lg-5 col-md-5">
                            <div className="product-image">
                                {badge &&
                                    <span className="onsale">{badge}</span>
                                }
                                <Link href={`/resturent/shop-single/${id}`} scroll={false}>
                                    <Image src={`/assets/img/shop/${thumb}`} alt="Product" width={450} height={450} />
                                </Link>
                                <div className="shop-action">
                                    <ul>
                                        <li className="cart"  >
                                            <Link href="#" onClick={handleAddToCart} scroll={false}><span>{staticData.ui.singleProductList.addToCartLabel}</span></Link>
                                        </li>
                                        <li className="wishlist">
                                            <Link href="#" scroll={false}><span>{staticData.ui.singleProductList.wishlistLabel}</span></Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-7">
                            <div className="product-caption">
                                <div className="product-tags">
                                    {productTag.map((data, index) =>
                                        <Link href="#" key={index}>{data}</Link>
                                    )}
                                </div>
                                <h4 className="product-title">
                                    <Link href={`/resturent/shop-single/${id}`}>{title}</Link>
                                </h4>
                                <div className="price">
                                    <span className={oldPrice ? '' : 'd-none'}>
                                        <del>${oldPrice ? oldP : ''}</del>
                                    </span>
                                    <span className='ms-2'>${newP}</span>
                                </div>
                                <Link href="#" className="cart-btn" onClick={handleAddToCart} scroll={false}>
                                    <i className="fas fa-shopping-bag"></i> {btnText}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </>
    );
};

export default SingleProductList;
