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
  return useApiMutation(API_BASE, "POST");
};

const updateUser = async (
  url: MutationKey,
  { arg: { userId, user } }: { arg: { userId: string | number; user: User } }
) => {
  if (!userId) {
    return undefined;
  }

  const { data } = await api.request({
    url: API_ENDPOINTS.SINGLE_USER(userId),
    method: "PUT",
    data: user,
  });
  return data;
};

export const useUpdateUser = () => {
  return useApiMutation(API_ENDPOINTS.USERS, "PUT", updateUser);
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
