"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "./types";
import { findUserByPhone, createUser } from "./store";

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    phone: string;
    password: string;
    role?: "CUSTOMER" | "RIDER";
  }) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage (demo only)
    const stored = localStorage.getItem("dlv_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("dlv_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    const found = findUserByPhone(phone);
    if (!found || found.password !== password) {
      throw new Error("Invalid phone number or password");
    }
    setUser(found);
    localStorage.setItem("dlv_user", JSON.stringify(found));
    return found;
  };

  const register = async (data: {
    name: string;
    phone: string;
    password: string;
    role?: "CUSTOMER" | "RIDER";
  }) => {
    const newUser = createUser(data);
    setUser(newUser);
    localStorage.setItem("dlv_user", JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dlv_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
