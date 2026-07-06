import Link from 'next/link';
import Image from 'next/image';

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

const SingleProductGrid = ({ product }: { product: DataType }) => {
    const { id, thumb, badge, title, newPrice, oldPrice, btnText, productTag } = product

    const newP = (Math.floor(newPrice)).toFixed(2);
    const oldP = oldPrice?.toFixed(2) ?? '';

    const handleAddToCart = () => {
        alert(`${title} added to cart! (Static Mode)`);
    };

    return (
        <>
            <li className="product col-12">
                <div className="product-contents">
                    <div className="product-image">
                        {badge &&
                            <span className="onsale">{badge}</span>
                        }
                        <Link href={`/resturent/shop-single/${id}`}>
                            <Image src={`/assets/img/shop/${thumb}`} alt="Product" width={450} height={450} />
                        </Link>
                        <div className="shop-action">
                            <ul>
                                <li className="wishlist">
                                    <Link href="#" scroll={false}><span>Add to wishlist</span></Link>
                                </li>
                                <li className="quick-view">
                                    <Link href="#" scroll={false}><span>Quick view</span></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
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
                        <Link href="#" className="cart-btn" scroll={false} onClick={handleAddToCart}>
                            <i className="fas fa-shopping-bag"></i>{btnText}
                        </Link>
                    </div>
                </div>
            </li>
        </>
    );
};

export default SingleProductGrid;
