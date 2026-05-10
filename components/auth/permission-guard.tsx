// components/permission-guard.tsx
"use client";

import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  permission: string;
  children: React.ReactNode;
};

export function PermissionGuard({ permission, children }: Props) {
  const { hasPermission, loading } = useAuth();

  if (loading) return null;
  if (!hasPermission(permission)) redirect("/overview/dashboard");

  return <>{children}</>;
}
