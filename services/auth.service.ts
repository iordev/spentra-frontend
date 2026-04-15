import api from "@/lib/public-api";
import { CheckEmailResponse } from "@/types/auth.types";

export const authService = {
  checkEmail: async (email: string): Promise<CheckEmailResponse> => {
    const { data } = await api.post<{ data: CheckEmailResponse }>("/auth/check-email", {
      email,
    });
    return data.data;
  },
};
