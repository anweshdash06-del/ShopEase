import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Spinner, PageHeader } from "../components/UI.jsx";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner full />;
  if (!order) return <div className="max-w-5xl mx-auto px-4 py-16 text-center">Order not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader title={`Order #${order._id.slice(-8).toUpperCase()}`} subtitle={`Placed on ${new Date(order.createdAt).toLocaleString()}`} />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Order Status</h3>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Payment Method: {order.paymentMethod}</span>
              <span>{order.isPaid ? "Paid" : "Payment Pending"}</span>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product}`} className="text-sm font-medium text-gray-800 hover:text-brand-600 line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} x ₹{item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-sm text-gray-800">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zip}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="card p-5 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Price</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
