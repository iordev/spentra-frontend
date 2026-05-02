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
  // Step 1
  email: string;
  // Step 2
  username: string;
  // Step 3
  password: string;
  confirmPassword: string;
  // Step 4
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  // Step 5
  gender: string;
  // Step 6
  birthday: Date | null;
  // Step 7
  occupationId: number | null;
  // Step 8
  countryId: number | null;
  currencyId: number | null;
  timezoneId: number | null;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  gender: string;
  birthDate: string; // ISO string converted from Date
  occupationId: number;
  countryId: number;
  currencyId: number;
  timezoneId: number;
}

export interface OAuthRegisterDto {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  gender: string;
  birthDate: string;
  occupationId: number;
  countryId: number;
  currencyId: number;
  timezoneId: number;
  provider: string;
}

export interface RegisterResponse {
  message: string;
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
  isOnboarded: boolean;
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
