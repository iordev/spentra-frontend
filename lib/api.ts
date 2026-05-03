import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3500/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Don't retry if:
    // 1. Already retried
    // 2. The failed request IS the refresh endpoint
    // 3. The failed request is the login endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch {
        // Refresh failed — clear user and redirect
        useAuthStore.getState().clearUser();
        window.location.href = "/signin";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
