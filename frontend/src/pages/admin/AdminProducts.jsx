import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { Spinner, PageHeader } from "../../components/UI.jsx";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  stock: "",
  brand: "",
  isFeatured: false,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setExistingImages([]);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      discountPrice: p.discountPrice || "",
      category: p.category?._id || "",
      stock: p.stock,
      brand: p.brand || "",
      isFeatured: p.isFeatured,
    });
    setExistingImages(p.images || []);
    setImages([]);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      existingImages.forEach((img) => fd.append("keepImages", img));
      images.forEach((img) => fd.append("images", img));

      if (editingId) {
        await api.put(`/products/${editingId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product updated");
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product created");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Products" subtitle={`${products.length} total products`} />
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 h-fit">
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                </td>
                <td className="p-3 text-gray-600">{p.category?.name}</td>
                <td className="p-3 text-gray-800">₹{p.price}</td>
                <td className="p-3">
                  <span className={p.stock <= 5 ? "text-amber-600 font-medium" : "text-gray-600"}>{p.stock}</span>
                </td>
                <td className="p-3">{p.isFeatured ? "Yes" : "No"}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="text-brand-600 hover:bg-brand-50 p-2 rounded-lg">
                      <FiEdit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Product" : "Add Product"}</h3>
              <button onClick={() => setShowModal(false)}>
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Product Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" className="input-field" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Discount Price (₹, optional)</label>
                  <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} min="0" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} required className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Stock Quantity</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} required min="0" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Brand (optional)</label>
                  <input name="brand" value={form.brand} onChange={handleChange} className="input-field" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mt-6">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                  Mark as Featured
                </label>
              </div>

              {existingImages.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Current Images</label>
                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img src={img} alt="" className="w-full h-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 block mb-1">Upload New Images (up to 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
