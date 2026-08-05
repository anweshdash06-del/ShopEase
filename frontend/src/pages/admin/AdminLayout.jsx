import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiUsers, FiArrowLeft } from "react-icons/fi";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/admin/products", label: "Products", icon: <FiBox /> },
  { to: "/admin/categories", label: "Categories", icon: <FiTag /> },
  { to: "/admin/orders", label: "Orders", icon: <FiShoppingBag /> },
  { to: "/admin/users", label: "Users", icon: <FiUsers /> },
];

const AdminLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-6">
      <aside className="md:col-span-1">
        <div className="card p-4 sticky top-20">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">Admin Panel</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-gray-100 mt-3 pt-3">
            <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
              <FiArrowLeft /> Back to Store
            </NavLink>
          </div>
        </div>
      </aside>
      <div className="md:col-span-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
