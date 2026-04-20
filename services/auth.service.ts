import api from "@/lib/public-api";
import {
  CheckEmailResponse,
  CheckUsernameResponse,
  CountriesResponse,
  CurrenciesResponse,
  LoginResponse,
  OccupationsResponse,
  TimezonesResponse,
} from "@/types/auth.types";

export const authService = {
  login: async (identifier: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<{ data: LoginResponse }>("/auth/login", {
      identifier,
      password,
    });
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  checkEmail: async (email: string): Promise<CheckEmailResponse> => {
    const { data } = await api.post<{ data: CheckEmailResponse }>("/auth/check-email", {
      email,
    });
    return data.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> => {
    await api.post("/auth/reset-password", { token, newPassword, confirmPassword });
  },

  checkUsername: async (username: string): Promise<CheckUsernameResponse> => {
    const { data } = await api.post<{ data: CheckUsernameResponse }>("/auth/check-username", {
      username,
    });
    return data.data;
  },

  getCountries: async (): Promise<CountriesResponse> => {
    const { data } = await api.get<{ data: CountriesResponse }>("/countries", {
      params: {
        status: "Active",
        sortBy: "name",
        order: "asc",
        all: true,
      },
    });
    return data.data;
  },

  getCurrencies: async (): Promise<CurrenciesResponse> => {
    const { data } = await api.get<{ data: CurrenciesResponse }>("/currencies", {
      params: {
        status: "Active",
        sortBy: "name",
        order: "asc",
        all: true,
      },
    });
    return data.data;
  },
  getTimezones: async (): Promise<TimezonesResponse> => {
    const { data } = await api.get<{ data: TimezonesResponse }>("/timezones", {
      params: {
        status: "Active",
        sortBy: "name",
        order: "asc",
        all: true,
      },
    });
    return data.data;
  },

  getOccupations: async (): Promise<OccupationsResponse> => {
    const { data } = await api.get<{ data: OccupationsResponse }>("/occupations", {
      params: {
        status: "Active",
        sortBy: "name",
        order: "asc",
        all: true,
      },
    });
    return data.data;
  },
};
