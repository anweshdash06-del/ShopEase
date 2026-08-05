import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import api from "../api/axios";
import { Spinner, PageHeader, EmptyState } from "../components/UI.jsx";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/myorders")
      .then(({ data }) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner full />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader title="My Orders" subtitle="Track and review your past orders" />

      {orders.length === 0 ? (
        <EmptyState
          icon={<FiPackage size={48} className="text-gray-300" />}
          title="No orders yet"
          description="When you place an order, it will show up here."
          action={
            <Link to="/products" className="btn-primary mt-4">
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex flex-wrap gap-4 items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="font-mono text-sm text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Placed On</p>
                <p className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Items</p>
                <p className="text-sm text-gray-700">{order.items.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-sm font-semibold text-gray-900">₹{order.totalPrice}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
