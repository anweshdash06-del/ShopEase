import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { Spinner, PageHeader } from "../../components/UI.jsx";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update order");
    }
  };

  if (loading) return <Spinner />;

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} total orders`} />

      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
              filter === s ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id} className="border-t border-gray-100">
                <td className="p-3 font-mono text-xs text-gray-600">#{o._id.slice(-8).toUpperCase()}</td>
                <td className="p-3 text-gray-700">{o.user?.name}<br /><span className="text-xs text-gray-400">{o.user?.email}</span></td>
                <td className="p-3 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-3 font-semibold text-gray-800">₹{o.totalPrice}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${statusColors[o.status]}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-right">
                  <Link to={`/orders/${o._id}`} className="text-brand-600 hover:underline text-xs">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <p className="text-center text-gray-500 py-8 text-sm">No orders found.</p>}
      </div>
    </div>
  );
};

export default AdminOrders;
