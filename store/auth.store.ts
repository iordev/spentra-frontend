// store/auth.store.ts
import { create } from "zustand";
import { LoginResponse } from "@/types/auth.types";

interface AuthState {
  user: LoginResponse | null;
  setUser: (user: LoginResponse) => void;
  clearUser: () => void;
}

// ✅ no persist — React Query + AuthContext is the source of truth
export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));
