export interface CheckEmailResponse {
  exists: boolean;
}

export interface CheckUsernameResponse {
  exists: boolean;
}

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
