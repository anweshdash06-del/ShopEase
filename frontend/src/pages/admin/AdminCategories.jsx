import React, { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { Spinner, PageHeader } from "../../components/UI.jsx";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setImage(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, description: c.description || "" });
    setImage(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (image) fd.append("image", image);

      if (editingId) {
        await api.put(`/categories/${editingId}`, fd);
        toast.success("Category updated");
      } else {
        await api.post("/categories", fd);
        toast.success("Category created");
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete category");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Categories" subtitle={`${categories.length} total categories`} />
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 h-fit">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{c.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="text-brand-600 hover:bg-brand-50 p-1.5 rounded-lg">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingId ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)}>
                <FiX size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Category Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
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

export default AdminCategories;
