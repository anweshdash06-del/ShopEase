import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader, Spinner } from "../components/UI.jsx";

const Profile = () => {
  const { updateUserInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: { street: "", city: "", state: "", zip: "", country: "" },
  });

  useEffect(() => {
    api
      .get("/auth/profile")
      .then(({ data }) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zip: data.address?.zip || "",
            country: data.address?.country || "",
          },
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAddressChange = (e) =>
    setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, phone: form.phone, address: form.address };
      if (form.password) payload.password = form.password;
      const { data } = await api.put("/auth/profile", payload);
      updateUserInfo({ name: data.name, phone: data.phone, address: data.address });
      toast.success("Profile updated successfully");
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader title="My Profile" subtitle="Manage your personal information and address" />

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Personal Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email (cannot be changed)</label>
              <input value={form.email} disabled className="input-field bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Default Shipping Address</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Street</label>
              <input name="street" value={form.address.street} onChange={handleAddressChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">City</label>
              <input name="city" value={form.address.city} onChange={handleAddressChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">State</label>
              <input name="state" value={form.address.state} onChange={handleAddressChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">ZIP Code</label>
              <input name="zip" value={form.address.zip} onChange={handleAddressChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Country</label>
              <input name="country" value={form.address.country} onChange={handleAddressChange} className="input-field" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
