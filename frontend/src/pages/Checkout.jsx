import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader } from "../components/UI.jsx";

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const shipping = itemsPrice > 1000 ? 0 : 50;
  const total = itemsPrice + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      const items = cartItems.map((item) => ({ product: item.product, quantity: item.quantity }));
      const { data } = await api.post("/orders", {
        items,
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader title="Checkout" subtitle="Enter your shipping details to complete your order" />

      <div className="grid md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 card p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Street Address</label>
            <input name="street" value={form.street} onChange={handleChange} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">State</label>
              <input name="state" value={form.state} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">ZIP / Postal Code</label>
              <input name="zip" value={form.zip} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <h3 className="font-semibold text-gray-800 pt-4">Payment Method</h3>
          <div className="space-y-2">
            {["Cash on Delivery", "Credit/Debit Card", "UPI"].map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm text-gray-700 card p-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
                {m}
              </label>
            ))}
          </div>
          {paymentMethod !== "Cash on Delivery" && (
            <p className="text-xs text-gray-500">
              This is a demo project — no real payment gateway is integrated. Your order will be recorded as placed.
            </p>
          )}

          <button type="submit" disabled={placing} className="btn-primary w-full mt-4">
            {placing ? "Placing Order..." : `Place Order — ₹${total}`}
          </button>
        </form>

        <div className="card p-5 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.product} className="flex justify-between text-sm">
                <span className="text-gray-600 line-clamp-1 pr-2">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-medium text-gray-800 shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
