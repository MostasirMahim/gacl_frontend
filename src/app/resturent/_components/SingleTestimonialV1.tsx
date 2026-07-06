import RatingsStar from './RatingsStar';

interface DataType {
    id: number;
    ratings: number;
    rate: string;
    title: string;
    text: string;
    name: string;
    designation: string;
}

const SingleTestimonialV1 = ({ testimonial }: { testimonial: DataType }) => {
    const { ratings, rate, title, text, name, designation } = testimonial

    return (
        <>
            <div className="testimonial-style-one">
                <div className="item">
                    <div className="content">
                        <div className="rating">
                            <div className="icon">
                                <RatingsStar ratings={ratings} />
                            </div>
                            <span>({rate})</span>
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
