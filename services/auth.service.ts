import api from "@/lib/public-api";
import {
  CheckEmailResponse,
  CheckUsernameResponse,
  CountriesResponse,
  CurrenciesResponse,
  OccupationsResponse,
  TimezonesResponse,
} from "@/types/auth.types";

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
