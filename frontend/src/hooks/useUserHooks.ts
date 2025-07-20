import { API_ENDPOINTS } from "@/lib/api-endpoints";
import type { User } from "../types";
import { api, useApi, useApiMutation, type MutationKey } from "./useApi";

const API_BASE = "/users";

export const useUsers = (partnerId?: number) => {
  const url = partnerId ? `${API_BASE}?partner_id=${partnerId}` : API_BASE;
  return useApi<User[]>(url);
};

export const useUser = (userId: number | null) => {
  return useApi<User>(userId ? `${API_BASE}/${userId}` : null);
};

export const useCreateUser = () => {
  return useApiMutation<User, Error>(API_BASE, "POST");
};

export const useUpdateUser = (userId: number) => {
  return useApiMutation<User, Error>(`${API_BASE}/${userId}`, "PUT");
};

const deleteUser = async (
  url: MutationKey,
  { arg: { userId } }: { arg: { userId: string | number } }
) => {
  if (!userId) {
    return undefined;
  }

  const { data } = await api.request({
    url: API_ENDPOINTS.SINGLE_USER(userId),
    method: "DELETE",
  });
  return data;
};

export const useDeleteUser = () => {
  return useApiMutation(API_ENDPOINTS.USERS, "DELETE", deleteUser);
};

export const useUpdateUserRole = (userId: number) => {
  return useApiMutation(`${API_BASE}/${userId}/role`, "PATCH");
};
