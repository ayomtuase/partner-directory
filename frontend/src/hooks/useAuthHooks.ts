import type { AuthResponse, LoginData, User } from "../types";
import { api, useApi, useApiMutation } from "./useApi";

const API_BASE = "/auth";

export const useLogin = () => {
  return useApiMutation<LoginData, AuthResponse>(
    `${API_BASE}/login`,
    "POST",
    undefined,
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
    }
  );
};

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
  return useApi<User>(`${API_BASE}/me`);
};
