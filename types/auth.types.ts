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
