import useSWR, { type SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

import Axios, { AxiosError } from "axios";
import { type FetcherResponse } from "swr/_internal";
import { type SWRMutationConfiguration } from "swr/mutation";

export type MutationKey = string | null | undefined;

export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export type APIError = AxiosError<{
  msg?: string;
  message?: string;
  data: unknown;
  success: boolean;
}>;

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data;
};

const useApi = <T>(url: string | null, options?: SWRConfiguration) => {
  const { data, mutate, error, isLoading } = useSWR<T, APIError>(
    url ?? null,
    fetcher,
    options
  );
  return {
    data,
    error,
    isLoading,
    mutate,
    key: url,
  };
};

const useApiMutation = <RequestPayload, ResponseData>(
  url: MutationKey,
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  customRequestFunction?: (
    url: MutationKey,
    {
      arg,
    }: {
      arg: RequestPayload;
    }
  ) => FetcherResponse<ResponseData>,
  options?: SWRMutationConfiguration<
    ResponseData,
    APIError,
    MutationKey,
    RequestPayload
  >
) => {
  const request = async (
    url: MutationKey,
    { arg }: { arg: RequestPayload }
  ) => {
    if (!url) {
      return undefined;
    }
    const { data } = await api.request({
      url: url,
      method,
      data: arg,
    });
    return data;
  };

  return useSWRMutation<
    ResponseData,
    APIError,
    MutationKey,
    RequestPayload,
    unknown
  >(url, customRequestFunction || request, {
    throwOnError: false,
    ...options,
  });
};

export { useApi, useApiMutation };
