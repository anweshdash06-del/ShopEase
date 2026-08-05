import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-lg font-bold text-white">ShopEase</span>
          </div>
          <p className="text-sm text-gray-400">
            Your one-stop online shop for electronics, fashion, home essentials and books — at prices you'll love.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-white">Featured</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-white">My Profile</Link></li>
            <li><Link to="/orders" className="hover:text-white">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-white">Login / Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400 mb-3">support@shopease.com</p>
          <div className="flex gap-3">
            <a href="#" className="hover:text-white"><FiFacebook /></a>
            <a href="#" className="hover:text-white"><FiInstagram /></a>
            <a href="#" className="hover:text-white"><FiTwitter /></a>
            <a href="#" className="hover:text-white"><FiMail /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} ShopEase. Built with the MERN Stack. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
