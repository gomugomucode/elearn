// src/context/AuthContext.jsx
// @refresh reset
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const navigate = useNavigate();

  // Load user from localStorage on app load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Failed to load saved user:", err);
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setAuthLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save user
      const userData = data.user;
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsLoggedIn(true);

      // Redirect by role
      if (userData.role === "admin") navigate("/admin/dashboard");
      if (userData.role === "teacher") navigate("/teacher/dashboard");
      if (userData.role === "student") navigate("/student/dashboard");

      return userData;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
