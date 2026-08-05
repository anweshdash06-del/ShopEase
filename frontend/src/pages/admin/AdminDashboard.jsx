import React, { useEffect, useState } from "react";
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import api from "../../api/axios";
import { Spinner, PageHeader } from "../../components/UI.jsx";

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <p className="text-gray-500">Could not load dashboard stats.</p>;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your store's performance" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiUsers />} label="Total Customers" value={stats.totalUsers} color="bg-brand-50 text-brand-600" />
        <StatCard icon={<FiBox />} label="Total Products" value={stats.totalProducts} color="bg-purple-50 text-purple-600" />
        <StatCard icon={<FiShoppingBag />} label="Total Orders" value={stats.totalOrders} color="bg-orange-50 text-orange-600" />
        <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`₹${stats.totalRevenue}`} color="bg-green-50 text-green-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {stats.statusCounts.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
            {stats.statusCounts.map((s) => (
              <div key={s._id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{s._id}</span>
                <div className="flex items-center gap-2 flex-1 mx-4">
                  <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${(s.count / stats.totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-medium text-gray-800">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" /> Low Stock Alert
          </h3>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-500">All products are well stocked.</p>
          ) : (
            <div className="space-y-2">
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{p.name}</span>
                  <span className={`font-medium ${p.stock === 0 ? "text-red-500" : "text-amber-600"}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
