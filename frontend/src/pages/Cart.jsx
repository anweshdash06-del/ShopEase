import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { EmptyState, PageHeader } from "../components/UI.jsx";
import { toast } from "react-toastify";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = itemsPrice > 1000 || itemsPrice === 0 ? 0 : 50;
  const total = itemsPrice + shipping;

  const handleCheckout = () => {
    if (!user) {
      toast.info("Please login to continue");
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState
          icon={<FiShoppingBag size={48} className="text-gray-300" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          action={
            <Link to="/products" className="btn-primary mt-4">
              Start Shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader title="Shopping Cart" subtitle={`${cartItems.length} item(s) in your cart`} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product} className="card p-4 flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product}`} className="font-medium text-gray-800 hover:text-brand-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">₹{item.price} each</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => updateQuantity(item.product, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <FiMinus size={12} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <FiPlus size={12} />
                </button>
              </div>
              <p className="w-20 text-right font-semibold text-gray-800">₹{item.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.product)}
                className="text-gray-400 hover:text-red-500"
                aria-label="Remove item"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            {itemsPrice < 1000 && itemsPrice > 0 && (
              <p className="text-xs text-brand-600">Add ₹{1000 - itemsPrice} more for free shipping!</p>
            )}
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-4 mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
            Proceed to Checkout <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
