import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api/axios";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((user: User, token: string) => {
    setUser(user)
    setAccessToken(token)
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null)
    setAccessToken(null)
  }, [])

  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await api.post("/auth/refresh");
        
        if (res.data.accessToken && res.data.user) {
          setUser(res.data.user);
          setAccessToken(res.data.accessToken);
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    }
    
    restoreSession();
  }, [clearAuth]);

  return (
    <AuthContext.Provider value={{ setAuth, clearAuth, user, accessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const cxt = useContext(AuthContext)
  if (!cxt) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return cxt
}

