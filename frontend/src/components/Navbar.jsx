import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiGrid } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/products?keyword=${encodeURIComponent(search.trim())}` : "/products");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="text-xl font-extrabold text-gray-800 hidden sm:block">ShopEase</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <FiSearch size={18} />
            </button>
          </form>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-brand-600">
              <FiShoppingCart size={22} />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 text-gray-700 hover:text-brand-600"
                >
                  <FiUser size={20} />
                  <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                </button>
                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  >
                    <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      My Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:block btn-primary text-sm">
                Login
              </Link>
            )}

            <button className="md:hidden text-gray-700" onClick={() => setMenuOpen((o) => !o)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-full pl-4 pr-10 py-2 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <FiSearch size={18} />
              </button>
            </form>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 py-1">
              <FiGrid /> All Products
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                  <FiUser /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                  <FiPackage /> My Orders
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-700 py-1">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="text-sm text-red-600 py-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-sm inline-block">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
