import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner } from "../components/UI.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setActiveImg(0);
      setQty(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please login to leave a review");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spinner full />;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center">Product not found.</div>;

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link> /{" "}
        <Link to="/products" className="hover:text-brand-600">Products</Link> /{" "}
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="card aspect-square overflow-hidden mb-3 bg-gray-100">
            {product.images?.length > 0 ? (
              <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    activeImg === i ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-brand-600 font-medium mb-1">{product.category?.name}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          {product.brand && <p className="text-sm text-gray-500 mb-3">Brand: {product.brand}</p>}

          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar key={s} className={s <= Math.round(product.rating) ? "fill-yellow-400" : ""} size={16} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">₹{finalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                <span className="text-sm font-semibold text-accent-600">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-6 text-sm">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <FiCheckCircle /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <FiPlus size={14} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="btn-primary flex items-center gap-2 flex-1 justify-center"
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

        {product.reviews?.length > 0 ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map((r, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} className={s <= r.rating ? "fill-yellow-400" : ""} size={12} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8 text-sm">No reviews yet. Be the first to review this product!</p>
        )}

        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
          <form onSubmit={submitReview} className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button type="button" key={s} onClick={() => setRating(s)}>
                    <FiStar className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} size={22} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Share your experience with this product..."
              />
            </div>
            <button type="submit" disabled={submittingReview} className="btn-primary text-sm">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
