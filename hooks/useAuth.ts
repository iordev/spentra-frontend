import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

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
