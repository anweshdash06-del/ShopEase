import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import api from "../api/axios";
import ProductCard from "../components/ProductCard.jsx";
import { Spinner, PageHeader, EmptyState } from "../components/UI.jsx";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pages, setPages] = useState(1);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);
      if (featured) params.set("featured", featured);
      if (searchParams.get("minPrice")) params.set("minPrice", searchParams.get("minPrice"));
      if (searchParams.get("maxPrice")) params.set("maxPrice", searchParams.get("maxPrice"));
      params.set("page", page);
      params.set("limit", 12);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, featured, page, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set("minPrice", minPrice);
    else next.delete("minPrice");
    if (maxPrice) next.set("maxPrice", maxPrice);
    else next.delete("maxPrice");
    next.delete("page");
    setSearchParams(next);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title={keyword ? `Search results for "${keyword}"` : "All Products"}
        subtitle={`${products.length > 0 ? `Showing page ${page} of ${pages}` : ""}`}
      />

      <div className="flex items-center justify-between mb-4 md:hidden">
        <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary flex items-center gap-2 text-sm">
          <FiFilter size={16} /> Filters
        </button>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <aside className={`${showFilters ? "block" : "hidden"} md:block card p-4 h-fit`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            <button onClick={clearFilters} className="text-xs text-brand-600 hover:underline">
              Clear all
            </button>
            <button className="md:hidden" onClick={() => setShowFilters(false)}>
              <FiX />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="category"
                  checked={!category}
                  onChange={() => updateParam("category", "")}
                />
                All Categories
              </label>
              {categories.map((c) => (
                <label key={c._id} className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="radio"
                    name="category"
                    checked={category === c._id}
                    onChange={() => updateParam("category", c._id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Price Range (₹)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input-field text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field text-sm"
              />
            </div>
            <button onClick={applyPriceFilter} className="btn-primary text-sm mt-2 w-full">
              Apply
            </button>
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 mb-2">Sort By</p>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input-field text-sm">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        {/* Product grid */}
        <div className="md:col-span-3">
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<span className="text-5xl">🔍</span>}
              title="No products found"
              description="Try adjusting your filters or search keyword."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        p === page ? "bg-brand-600 text-white" : "bg-white border border-gray-300 text-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
