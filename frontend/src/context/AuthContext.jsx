import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password, phone });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success("Account created successfully!");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    toast.info("Logged out");
  };

  const updateUserInfo = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    localStorage.setItem("userInfo", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
