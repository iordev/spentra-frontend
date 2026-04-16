import api from "@/lib/public-api";
import { CheckEmailResponse, CheckUsernameResponse } from "@/types/auth.types";

export const authService = {
  checkEmail: async (email: string): Promise<CheckEmailResponse> => {
    const { data } = await api.post<{ data: CheckEmailResponse }>("/auth/check-email", {
      email,
    });
    return data.data;
  },

  checkUsername: async (username: string): Promise<CheckUsernameResponse> => {
    const { data } = await api.post<{ data: CheckUsernameResponse }>("/auth/check-username", {
      username,
    });
    return data.data;
  },
};
