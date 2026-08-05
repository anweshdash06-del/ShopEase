import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }
    addToCart(product, 1);
  };

  return (
    <Link to={`/products/${product._id}`} className="card group overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-semibold">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-brand-600 font-medium mb-1">{product.category?.name}</p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
            {product.rating.toFixed(1)} ({product.numReviews})
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-gray-900">₹{product.discountPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-gray-900">₹{product.price}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
