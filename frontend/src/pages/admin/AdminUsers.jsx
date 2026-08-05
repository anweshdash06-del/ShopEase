import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { Spinner, PageHeader } from "../../components/UI.jsx";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/block`);
      toast.success(data.message);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isBlocked: data.isBlocked } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update user");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${users.length} registered customers`} />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3 text-gray-600">{u.email}</td>
                <td className="p-3 text-gray-600">{u.phone || "-"}</td>
                <td className="p-3 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                      u.isBlocked ? "text-green-600 border-green-300 hover:bg-green-50" : "text-red-600 border-red-300 hover:bg-red-50"
                    }`}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-gray-500 py-8 text-sm">No customers registered yet.</p>}
      </div>
    </div>
  );
};

export default AdminUsers;
