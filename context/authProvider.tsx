"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import api, { setAuthToken } from "@/lib/axios";
import { User } from "@/types/types";
import LoadingPage from "../app/dashboard/components/loading"; // Import loading page

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  role: string;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const fetchUser = async () => {
  try {
    const { data } = await api.get("/api/user");
    return data;
  } catch (error) {
    console.error("Token verification failed", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, mutate } = useSWR("/api/user", fetchUser, { refreshInterval: 60000 });

  const user = data?.user || null;
  const role = data?.role || "";
  const isAuthenticated:boolean = !!user;

  useEffect(() => {
    if (isAuthenticated && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router,pathname]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/api/login", { email, password });
      const { accessToken } = data;
  
      setAuthToken(accessToken);
      await mutate();
    } catch (error: unknown) {
      console.error("Login failed", error);
      throw new Error("Invalid username or password");
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
      setAuthToken(null);
      mutate(null, false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }

  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role, isLoading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;