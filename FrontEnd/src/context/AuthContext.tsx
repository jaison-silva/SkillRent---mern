import React, { createContext, useContext, useState, useEffect } from "react";
import { logoutApi } from "../api/auth.api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token?: string; // Access token
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser({ ...JSON.parse(storedUser), token: storedToken });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    const { token, ...userWithoutToken } = userData;
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userWithoutToken));
    if (token) {
        localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    try {
        logoutApi(); // Clear backend cookies
    } catch (err) {
        console.error("Logout API failed", err);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
