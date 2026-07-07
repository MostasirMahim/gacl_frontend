import RatingsStar from './RatingsStar';

interface DataType {
    id: number;
    ratings?: number;
    rating?: number;
    rate?: string;
    title: string;
    text: string;
    name: string;
    designation: string;
}

const SingleTestimonialV1 = ({ testimonial }: { testimonial: DataType }) => {
    const { id, ratings, rating, rate, title, text, name, designation } = testimonial;
    const finalRating = rating !== undefined && rating !== null ? rating : (ratings || 5);
    const finalRate = rate ? rate : `${finalRating} out of 5`;

    return (
        <>
            <div className="testimonial-style-one">
                <div className="item">
                    <div className="content">
                        <div className="rating">
                            <div className="icon">
                                <RatingsStar ratings={finalRating} />
                            </div>
                            <span>({finalRate})</span>
                        </div>
                        <h2>{title}</h2>
                        <p>{`“${text}”`}</p>
                    </div>
                    <div className="provider">
                        <i className="flaticon-quote"></i>
                        <div className="info">
                            <h4>{name}</h4>
                            <span>{designation}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleTestimonialV1;
