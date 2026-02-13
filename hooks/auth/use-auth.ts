"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/generated/prisma/enums";

export interface User {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  office: string | null;
  role: UserRole;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser: checkAuth,
  };
}
