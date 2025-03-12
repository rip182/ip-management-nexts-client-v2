"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/axios";
import { User } from '@/types/types';

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
  const [role, setRole] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setAuthToken(parsedUser.token);
        setIsAuthenticated(true);
        setRole(parsedUser.role || ''); 
        try {
          const response = await api.get("/api/user");
          setUser(response.data.user);
          setRole(response.data.role);
        } catch (error) {
          console.error("Token verification failed", error);
          setAuthToken(null);
          setUser(null);
          setIsAuthenticated(false);
          sessionStorage.removeItem("user");
          router.push("/login");
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/login", { email, password });
      const { accessToken, user, role } = response.data;

      setAuthToken(accessToken);
      setUser(user);
      setIsAuthenticated(true);
      setRole(role);
      sessionStorage.setItem("user", JSON.stringify({ accessToken, ...user, role }));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setRole('');
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};