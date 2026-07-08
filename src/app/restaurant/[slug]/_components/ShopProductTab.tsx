import ProductReviewForm from './ProductReviewForm';
import Link from 'next/link';
import Image from 'next/image';
import RatingsStar from './RatingsStar';
import { getMediaUrl } from '@/lib/utils';

interface ReviewType {
    id: number;
    rating: number;
    review_text: string;
    member_name: string;
    reviewer_avatar?: string;
    is_active?: boolean;
    created_at?: string;
}

interface ShopProductTabProps {
    itemId?: number;
    reviews?: ReviewType[];
    additionalInfo?: Record<string, string>;
}

const ShopProductTab = ({ itemId, reviews, additionalInfo }: ShopProductTabProps) => {
    const reviewsCount = reviews ? reviews.length : 0;
    const hasAdditional = additionalInfo && Object.keys(additionalInfo).length > 0;

    return (
        <>
            <div className="single-product-bottom-info">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">

                            <button className="nav-link active" id="description-tab-control" data-bs-toggle="tab" data-bs-target="#description-tab" type="button" role="tab" aria-controls="description-tab" aria-selected="true">
                                Description
                            </button>

                            <button className="nav-link" id="information-tab-control" data-bs-toggle="tab" data-bs-target="#information-tab" type="button" role="tab" aria-controls="information-tab" aria-selected="false">
                                Additional Information
                            </button>

                            <button className="nav-link" id="review-tab-control" data-bs-toggle="tab" data-bs-target="#review-tab" type="button" role="tab" aria-controls="review-tab" aria-selected="false">
                                Review
                            </button>

                        </div>

                        <div className="tab-content tab-content-info" id="myTabContent">

                            <div className="tab-pane fade show active" id="description-tab" role="tabpanel" aria-labelledby="description-tab-control">
                                <p>
                                    There is immense scope for organic production of vegetable crops in India since the agricultural sector has enormous organic resources like crop residues, livestock and other bio-products from agro industries. Organic farming is growing at a rapid pace among Indian farmers and entrepreneurs, particularly in rainfed and hilly areas where fertilizer consumption is less than 25 kg/ha/year [13].
                                </p>
                                <ul>
                                    <li>Status of organic vegetable production</li>
                                    <li>Feasibility of organic practices</li>
                                    <li>Sustainability of organic farming</li>
                                    <li>Organic certification</li>
                                    <li>Prospects and constraints of organic vegetable production</li>
                                </ul>
                            </div>

                            <div className="tab-pane fade" id="information-tab" role="tabpanel" aria-labelledby="information-tab-control">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            {hasAdditional ? (
                                                Object.entries(additionalInfo || {}).map(([key, val]) => (
                                                    <tr key={key}>
                                                        <td>{key}</td>
                                                        <td>{val}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <>
                                                    <tr>
                                                        <td>Weight</td>
                                                        <td>240 Ton</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dimensions</td>
                                                        <td>20 × 30 × 40 cm</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Colors</td>
                                                        <td>Black, Blue, Green</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="tab-pane fade" id="review-tab" role="tabpanel" aria-labelledby="review-tab-control">
                                <h4>{reviewsCount} review{reviewsCount !== 1 ? 's' : ''} for this item</h4>
                                <div className="review-items">
                                    {reviews && reviews.length > 0 ? (
                                        reviews.map((rev) => (
                                            <div className="item" key={rev.id}>
                                                <div className="thumb">
                                                    <Image 
                                                        src={rev.reviewer_avatar ? getMediaUrl(rev.reviewer_avatar) : "/assets/img/team/1.jpg"} 
                                                        width={800} 
                                                        height={800} 
                                                        alt="Thumb" 
                                                    />
                                                </div>
                                                <div className="info">
                                                    <div className="rating">
                                                        <RatingsStar ratings={rev.rating} />
                                                    </div>
                                                    <div className="review-date">
                                                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : ''}
                                                    </div>
                                                    <div className="review-authro">
                                                        <h5>{rev.member_name}</h5>
                                                    </div>
                                                    <p>
                                                        {rev.review_text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '20px 0', color: '#999', textAlign: 'center' }}>
                                            <i className="far fa-comment-dots" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                                            No reviews yet for this item.
                                        </div>
                                    )}
                                </div>
                                <div className="review-form">
                                    <h4>Add a review</h4>
                                    <ProductReviewForm itemId={itemId} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopProductTab;
