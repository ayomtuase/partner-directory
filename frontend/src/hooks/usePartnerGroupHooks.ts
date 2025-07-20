import type { PartnerGroup } from "../types";
import { useApi, useApiMutation } from "./useApi";

const API_BASE = "/partner-groups";

export const usePartnerGroups = () => {
  return useApi<PartnerGroup[]>(API_BASE);
};

export const usePartnerGroup = (groupId: number | null) => {
  return useApi<PartnerGroup>(groupId ? `${API_BASE}/${groupId}` : null);
};

export const useCreatePartnerGroup = () => {
  return useApiMutation<PartnerGroup, Error>(API_BASE, "POST");
};

export const useUpdatePartnerGroup = () => {
  return useApiMutation<PartnerGroup, Error>(API_BASE, "PUT");
};

export const useDeletePartnerGroup = () => {
  return useApiMutation<null, Error>(API_BASE, "DELETE");
};
