import type { Partner } from "../types";
import { useApi, useApiMutation } from "./useApi";

const API_BASE = "/partners";

type PartnerResponse = Partner;

type PartnersResponse = Partner[];

type SuccessResponse = {
  success: boolean;
};

export const usePartners = (groupId?: number) => {
  const url = groupId ? `${API_BASE}?group_id=${groupId}` : API_BASE;
  return useApi<Partner[]>(url);
};

export const usePartner = (partnerId: number | null) => {
  return useApi<PartnerResponse>(partnerId ? `${API_BASE}/${partnerId}` : null);
};

export const useSearchPartners = (country?: string, partnerType?: string) => {
  const params = new URLSearchParams();
  if (country) params.append("country", country);
  if (partnerType) params.append("type", partnerType);

  const query = params.toString();
  const url = query ? `${API_BASE}?${query}` : null;

  return useApi<PartnersResponse>(url);
};

export const useCreatePartner = () => {
  return useApiMutation<Omit<Partner, "id">, PartnerResponse>(API_BASE, "POST");
};

export const useUpdatePartner = () => {
  return useApiMutation<Partial<Partner> & { id: number }, PartnerResponse>(
    API_BASE,
    "PUT"
  );
};

export const useDeletePartner = () => {
  return useApiMutation<{ id: number }, SuccessResponse>(API_BASE, "DELETE");
};
