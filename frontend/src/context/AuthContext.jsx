import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

// Tạo context
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
        redirectToLogin();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (values) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login",
        values,{  withCredentials: true});
      setUser(res.data);
      if (res.data.roles.includes("ROLE_ADMIN")) {
        navigate("/admin", { replace: true });
      } else if (res.data.roles.includes("ROLE_PROVIDER")) {
        navigate("/provider", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      messageApi.success("Welcome back!");
    } catch (err) {
      setUser(null);
      messageApi.error(err.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logout = async () => {
    await axios.post("localhost:8080/api/auth/logout", null, { withCredentials: true });
    setUser(null);
  };

  // Kiểm tra vai trò
  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};
