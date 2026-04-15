import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://10.10.12.10:3500/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
