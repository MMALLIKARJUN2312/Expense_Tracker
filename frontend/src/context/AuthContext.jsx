import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContextCreate";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Persist user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Register
  const register = async (formData) => {
    try {
      const { data } = await API.post("/auth/register", formData);

      setUser(data.data);
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const { data } = await API.post("/auth/login", formData);

      setUser(data.data);
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
