import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 text-center">
    <h1 className="text-6xl font-extrabold text-brand-600 mb-4">404</h1>
    <p className="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
