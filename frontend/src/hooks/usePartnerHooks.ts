import { API_ENDPOINTS } from "@/lib/api-endpoints";
import type { Partner } from "../types";
import { api, useApi, useApiMutation, type MutationKey } from "./useApi";

type PartnerResponse = Partner;

type PartnersResponse = Partner[];

export const usePartners = (groupId?: number) => {
  const url = groupId
    ? `${API_ENDPOINTS.PARTNERS}?group_id=${groupId}`
    : API_ENDPOINTS.PARTNERS;
  return useApi<Partner[]>(url);
};

export const usePartner = (partnerId: number | null) => {
  return useApi<PartnerResponse>(
    partnerId ? `${API_ENDPOINTS.PARTNERS}/${partnerId}` : null
  );
};

export const useSearchPartners = (country?: string, partnerType?: string) => {
  const params = new URLSearchParams();
  if (country) params.append("country", country);
  if (partnerType) params.append("type", partnerType);

  const query = params.toString();
  const url = query ? `${API_ENDPOINTS.PARTNERS}?${query}` : null;

  return useApi<PartnersResponse>(url);
};

export const useCreatePartner = () => {
  return useApiMutation<Omit<Partner, "id">, PartnerResponse>(
    API_ENDPOINTS.PARTNERS,
    "POST"
  );
};

const updatePartner = async (
  url: MutationKey,
  {
    arg: { partnerId, partner },
  }: { arg: { partnerId: string | number; partner: Omit<Partner, "id"> } }
) => {
  if (!partnerId) {
    return undefined;
  }

  const { data } = await api.request({
    url: API_ENDPOINTS.SINGLE_PARTNER(partnerId),
    method: "PUT",
    data: partner,
  });
  return data;
};

export const useUpdatePartner = () => {
  return useApiMutation(API_ENDPOINTS.PARTNERS, "PUT", updatePartner);
};

const deletePartner = async (
  url: MutationKey,
  { arg: { partnerId } }: { arg: { partnerId: string | number } }
) => {
  if (!partnerId) {
    return undefined;
  }

  const { data } = await api.request({
    url: API_ENDPOINTS.SINGLE_PARTNER(partnerId),
    method: "DELETE",
  });
  return data;
};

export const useDeletePartner = () => {
  return useApiMutation(API_ENDPOINTS.PARTNERS, "DELETE", deletePartner);
};
