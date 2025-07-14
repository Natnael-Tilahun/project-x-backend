import { useApi } from "./useApi";
import type { MerchantOperators } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchantOperators = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getMerchantOperators: (merchantId: string, page?: number, size?: number) => ApiResult<MerchantOperators[]> = async (merchantId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantOperators[]>(
        `/api/v1/internal/merchants/${merchantId}/operators`,
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantOperators[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getMerchantOperatorById: (merchantId: string, id: string) => ApiResult<MerchantOperators> = async (merchantId, id) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantOperators>(
        `/api/v1/internal/merchants/${merchantId}/operators/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantOperators) : null;
    } catch (err) {
      throw err
    }
  };

  const createNeweMerchantOperator: (merchantId: string, operatorData: any) => ApiResult<MerchantOperators> = async ( merchantId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantOperators>(
        `/api/v1/internal/merchants/${merchantId}/operators`,
        {
          method: "POST",
          body: operatorData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantOperators) : null;
    } catch (err) {
      throw err
    }
  };

  const resetMerchantOperatorPassword: (merchantId: string, operatorId: string, operatorData: any) => ApiResult<any> = async ( merchantId, operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchants/${merchantId}/operators/${operatorId}/password-reset`,
        {
          method: "POST",
          body: operatorData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value) : null;
    } catch (err) {
      throw err
    }
  };

  const updateMerchantOperator: (merchantId: string, operatorId: string, operatorData: any) => ApiResult<MerchantOperators> = async (merchantId, operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantOperators>(
        `/api/v1/internal/merchants/${merchantId}/operators/${operatorId}`,
        {
          method: "PATCH",
          body: operatorData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantOperators) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteMerchantOperator: (merchantId: string, id: string) => ApiResult<any> = async (merchantId, id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchants/${merchantId}/operators/${id}`,
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

  return {
    isLoading,
    getMerchantOperators,
    getMerchantOperatorById,
    createNeweMerchantOperator,
    deleteMerchantOperator,
    updateMerchantOperator,
    resetMerchantOperatorPassword,
    isSubmitting,
  };
};