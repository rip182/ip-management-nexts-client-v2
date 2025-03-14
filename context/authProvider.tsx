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
  const { data, error, isLoading, mutate } = useSWR("/api/user", fetchUser, { refreshInterval: 60000 });

  const user = data?.user || null;
  const role = data?.role || "";
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isAuthenticated && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/api/login", { email, password });
      const { accessToken } = data;

      setAuthToken(accessToken);
      await mutate();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    mutate(null, false);
    router.push("/login");
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