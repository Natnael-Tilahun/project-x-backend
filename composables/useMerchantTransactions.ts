import { useApi } from "./useApi";
import type { MerchantTransaction } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchantTransactions = () => {
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();

  const getMerchantTransactions: (
    page?: number,
    size?: number
  ) => ApiResult<MerchantTransaction[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<
        MerchantTransaction[]
      >(`/api/v1/internal/merchants/transaction`, {
        params: { page, size },
      });

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value
        ? (data.value as unknown as MerchantTransaction[])
        : null;
    } catch (err) {
      throw err;
    }
  };

  const getMerchantTransactionById: (
    id: string
  ) => ApiResult<MerchantTransaction> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantTransaction>(
        `/api/v1/internal/merchants/transaction/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantTransaction) : null;
    } catch (err) {
      throw err;
    }
  };

  const getPendingMerchantTransactionByDynamicId: (
    id: string
  ) => ApiResult<MerchantTransaction[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<
        MerchantTransaction[]
      >(`/api/v1/internal/merchants/transaction/${id}/pending`);

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value
        ? (data.value as unknown as MerchantTransaction[])
        : null;
    } catch (err) {
      throw err;
    }
  };

  const getMerchantTransactionsCount: (
    page?: number,
    size?: number
  ) => ApiResult<MerchantTransaction[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<
        MerchantTransaction[]
      >(`/api/v1/internal/merchants/transaction/count`, {
        params: { page, size },
      });

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value
        ? (data.value as unknown as MerchantTransaction[])
        : null;
    } catch (err) {
      throw err;
    }
  };

  return {
    isLoading,
    getMerchantTransactionById,
    getMerchantTransactions,
    getMerchantTransactionsCount,
    getPendingMerchantTransactionByDynamicId,
  };
};
