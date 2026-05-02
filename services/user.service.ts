import api from "@/lib/api";

export const userService = {
  completeOnboarding: async (): Promise<void> => {
    await api.patch("/users/onboard");
  },
};
