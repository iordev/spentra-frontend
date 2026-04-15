import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: (email: string) => authService.checkEmail(email),
  });
};
