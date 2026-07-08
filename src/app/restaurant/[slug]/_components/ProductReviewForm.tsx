"use client";
import { useState } from "react";
import { toast } from "react-toastify";

interface ProductReviewFormProps {
  itemId?: number;
}

const ProductReviewForm = ({ itemId }: ProductReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Review Submited.Waiting For Admin Approval");
  };

  return (
    <>
      <form className="contact-form" onSubmit={handleForm}>
        <div className="row">
          <div className="col-lg-12">
            <div className="rating-select mb-3">
              <span className="mr-2">Your Rating:</span>
              <span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ cursor: "pointer" }}
                    className="text-warning mr-1"
                  >
                    <i
                      className={star <= rating ? "fas fa-star" : "far fa-star"}
                    ></i>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="form-group comments">
              <textarea
                className="form-control"
                id="comments"
                name="comments"
                placeholder="Your Review *"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <button
              type="submit"
              name="submit"
              id="submit"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </div>
        <div className="col-md-12 alert-notification">
          <div id="message" className="alert-msg"></div>
        </div>
      </form>
    </>
  );
};

export default ProductReviewForm;
