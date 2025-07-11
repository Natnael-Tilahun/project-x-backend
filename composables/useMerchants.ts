import { useApi } from "./useApi";
import type { Account, Merchant } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchants = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getMerchants: (page?: number, size?: number) => ApiResult<Merchant[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant[]>(
        '/api/v1/internal/merchants',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Merchant[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getMerchantById: (id: string) => ApiResult<Merchant> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Merchant) : null;
    } catch (err) {
      throw err
    }
  };

  const getMerchantAccountsId: (id: string) => ApiResult<Account[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Account[]>(
        `/api/v1/internal/merchants/${id}/accounts`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Account[]) : null;
    } catch (err) {
      throw err
    }
  };

  const createNeweMerchant: (merchantData: any) => ApiResult<Merchant> = async ( merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants`,
        {
          method: "POST",
          body: merchantData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Merchant) : null;
    } catch (err) {
      throw err
    }
  };

  const updateMerchant: (merchantId: string, merchantData: any) => ApiResult<Merchant> = async (merchantId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${merchantId}`,
        {
          method: "PATCH",
          body: merchantData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Merchant) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteMerchant: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchants/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const updateMerchantAccounts: (merchantId: string, merchantData: any) => ApiResult<any> = async (merchantId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${merchantId}/accounts`,
        {
          method: "POST",
          body: merchantData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    getMerchants,
    getMerchantById,
    createNeweMerchant,
    deleteMerchant,
    updateMerchant,
    getMerchantAccountsId,
    updateMerchantAccounts,
    isSubmitting,
  };
};
