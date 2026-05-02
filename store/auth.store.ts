import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "@/types/auth.types";

interface AuthState {
  user: LoginResponse | null;
  setUser: (user: {
    id: number;
    email: string;
    username: string;
    fullName: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    suffix: string | null;
    birthDate: string;
    gender: string;
    avatarUrl: string | null;
    theme: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    role: {
      id: number;
      name: string;
      description: string;
      permissions: { id: number; name: string }[];
    };
    occupation: { id: number; name: string };
    currency: { id: number; name: string; code: string; symbol: string };
    timezone: { id: number; name: string };
    country: { id: number; name: string; code: string };
    isOnboarded: boolean;
  }) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
