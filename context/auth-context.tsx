// context/auth-context.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useMe } from "@/hooks/useAuth";
import { LoginResponse } from "@/types/auth.types";

type AuthContextType = {
  me: LoginResponse | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ single source of truth — React Query handles caching
  const { data: me, isLoading } = useMe();

  const hasPermission = (permission: string) => me?.role.permissions.includes(permission) ?? false;

  const hasAnyPermission = (permissions: string[]) => permissions.some(p => hasPermission(p));

  const hasAllPermissions = (permissions: string[]) => permissions.every(p => hasPermission(p));
  return (
    <AuthContext.Provider
      value={{
        me: me ?? null,
        loading: isLoading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
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
