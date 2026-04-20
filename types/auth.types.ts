export interface CheckEmailResponse {
  exists: boolean;
}

export interface CheckUsernameResponse {
  exists: boolean;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  updatedAt: string;
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  updatedAt: string;
}

export interface Timezone {
  id: number;
  name: string;
  updatedAt: string;
}

export interface Occupation {
  id: number;
  name: string;
  updatedAt: string;
}

export type CountriesResponse = Country[];
export type CurrenciesResponse = Currency[];
export type TimezonesResponse = Timezone[];
export type OccupationsResponse = Occupation[];

export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  gender: string;
  birthday: Date | null;
}

export interface LoginResponse {
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
}
