import { useApi, useApiMutation } from './useApi';
import type { PartnerGroup } from '../types';

interface PartnerGroupResponse {
  data: PartnerGroup;
}

type PartnerGroupsResponse =  PartnerGroup[]

interface SuccessResponse {
  success: boolean;
}

export const usePartnerGroups = () => {
  return useApi<PartnerGroupsResponse>('/partner-groups?nocache=1');
};

export const usePartnerGroup = (id: number) => {
  return useApi<PartnerGroupResponse>(`/partner-groups/${id}`);
};

export const useCreatePartnerGroup = () => {
  return useApiMutation<Omit<PartnerGroup, 'id'>, PartnerGroupResponse>(
    '/partner-groups',
    'POST'
  );
};

export const useUpdatePartnerGroup = () => {
  return useApiMutation<Partial<PartnerGroup> & { id: number }, PartnerGroupResponse>(
    '/partner-groups',
    'PATCH'
  );
};

export const useDeletePartnerGroup = () => {
  return useApiMutation<{ id: number }, SuccessResponse>(
    '/partner-groups',
    'DELETE'
  );
};
