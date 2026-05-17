import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginResponse } from "@/types/auth.types";
import axios from "axios";
import { usePathname } from "next/navigation";

export const authKeys = {
  me: ["auth", "me"] as const,
};

// hooks/useAuth.ts
export const useMe = () => {
  const pathname = usePathname();

  // ✅ don't fetch on auth pages
  const isAuthPage =
    pathname?.startsWith("/signin") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/verify-email") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  return useQuery<LoginResponse>({
    queryKey: authKeys.me,
    queryFn: () => authService.me(),
    enabled: !isAuthPage, // ✅ disabled on auth pages
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: (failureCount, err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) return false;
      if (axios.isAxiosError(err) && err.response?.status === 429) return false;
      return failureCount < 2;
    },
  });
};

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: (email: string) => authService.checkEmail(email),
  });
};

export const useCheckUsername = () => {
  return useMutation({
    mutationFn: (username: string) => authService.checkUsername(username),
  });
};

export const useGetCountries = (enabled = false) => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => authService.getCountries(),
    enabled,
    staleTime: Infinity,
  });
};

export const useGetCurrencies = (enabled = false) => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: () => authService.getCurrencies(),
    enabled,
    staleTime: Infinity,
  });
};

export const useGetTimezones = (enabled = false) => {
  return useQuery({
    queryKey: ["timezones"],
    queryFn: () => authService.getTimezones(),
    enabled,
    staleTime: Infinity,
  });
};

export const useGetOccupations = (enabled = false) => {
  return useQuery({
    queryKey: ["occupations"],
    queryFn: () => authService.getOccupations(),
    enabled,
    staleTime: Infinity,
  });
};
