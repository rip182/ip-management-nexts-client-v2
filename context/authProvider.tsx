"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setAuthToken } from "@/lib/axios";
import {User} from '@/types/types'

interface AuthContextType {
  user: User|null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  role:string
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User|null>(null);
  const [role,setRole] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setAuthToken(parsedUser.token); // Store token in memory
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("api/login", { email, password });
      console.log(response)
      const { accessToken, user,role } = response.data;

      setAuthToken(accessToken);
      setUser(user);
      setIsAuthenticated(true);
      setRole(role);
      sessionStorage.setItem("user", JSON.stringify({ accessToken, ...user }));

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated,role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};
