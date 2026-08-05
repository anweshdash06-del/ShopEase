import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiArrowRight } from "react-icons/fi";
import api from "../api/axios";
import ProductCard from "../components/ProductCard.jsx";
import { Spinner } from "../components/UI.jsx";

const perks = [
  { icon: <FiTruck />, title: "Free Shipping", desc: "On orders above ₹1000" },
  { icon: <FiShield />, title: "Secure Payment", desc: "100% secure checkout" },
  { icon: <FiRefreshCw />, title: "Easy Returns", desc: "7-day return policy" },
  { icon: <FiHeadphones />, title: "24/7 Support", desc: "Dedicated support team" },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, latestRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products?featured=true&limit=8"),
          api.get("/products?limit=8&sort=newest"),
        ]);
        setCategories(catRes.data);
        setFeatured(featRes.data.products);
        setLatest(latestRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner full />;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-white/15 text-sm px-3 py-1 rounded-full mb-4">
              New Season Arrivals
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Shop Smarter. <br /> Live Better.
            </h1>
            <p className="text-brand-100 text-lg mb-8 max-w-md">
              Discover top-quality electronics, fashion, home essentials and books — all in one place, at prices you'll love.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-full hover:bg-brand-50 transition-colors"
            >
              Shop Now <FiArrowRight />
            </Link>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-72 h-72 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-56 h-56 rounded-full bg-white/15 flex items-center justify-center text-7xl">
                🛍️
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {perks.map((p) => (
          <div key={p.title} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-lg shrink-0">
              {p.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{p.title}</p>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="card p-6 text-center hover:shadow-md hover:border-brand-200 transition-all"
              >
                <p className="font-semibold text-gray-800">{cat.name}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products?featured=true" className="text-sm text-brand-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest products */}
      {latest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">New Arrivals</h2>
            <Link to="/products" className="text-sm text-brand-600 font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latest.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
