// context/auth-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Me = {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  theme: string;
  isOnboarded: boolean;
  role: {
    name: string;
    permissions: string[];
  };
  currency: { code: string; symbol: string };
  timezone: { name: string };
};

type AuthContextType = {
  me: Me | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(null); // ← always null on server
  const [loading, setLoading] = useState(true); // ← always true on server

  useEffect(() => {
    // No more setMe for cache here — already handled in useState above
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(res => {
        setTimeout(() => {
          setMe(res.data);
          sessionStorage.setItem("me", JSON.stringify(res.data));
          setLoading(false);
        }, 3000); // ← remove in production
      })
      .catch(() => {
        sessionStorage.removeItem("me");
        setMe(null);
        setLoading(false);
      });
  }, []);

  const hasPermission = (permission: string) => me?.role.permissions.includes(permission) ?? false;

  const hasAnyPermission = (permissions: string[]) => permissions.some(p => hasPermission(p));

  const hasAllPermissions = (permissions: string[]) => permissions.every(p => hasPermission(p));

  return (
    <AuthContext.Provider
      value={{ me, loading, hasPermission, hasAnyPermission, hasAllPermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
