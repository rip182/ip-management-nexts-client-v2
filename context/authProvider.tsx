"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/axios";
import { User } from "@/types/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  role: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/api/user");
        setUser(data.user);
        setRole(data.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/api/login", { email, password });
      const { accessToken, user, role } = data;

      setAuthToken(accessToken);
      setUser(user);
      setRole(role);
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setRole("");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
