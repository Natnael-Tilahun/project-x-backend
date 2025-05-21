import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Merchant } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchants = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
    }
  };

  const createNeweMerchant: (customerId: string, merchantData: any) => ApiResult<Merchant> = async (customerId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${customerId}`,
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
      handleApiError(err);
      return null;
    }
  };

  const updateMerchant: (customerId: string, merchantData: any) => ApiResult<Merchant> = async (customerId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${customerId}`,
        {
          method: "POST",
          body: merchantData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Merchant) : null;
    } catch (err) {
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    getMerchants,
    getMerchantById,
    createNeweMerchant,
    deleteMerchant,
    updateMerchant,
    isSubmitting,
  };
};
