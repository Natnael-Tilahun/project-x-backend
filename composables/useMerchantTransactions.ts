import { useApi } from "./useApi";
import type { MerchantTransaction } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchantTransactions = (merchantId: Ref<string>) => {
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();

  const endpoint = computed(() => {
    if (!merchantId?.value) return null;
    return `/api/v1/internal/merchants/${merchantId.value}/transaction`;
  });

  const {
    page,
    size,
    sort,
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
  } = usePagination<MerchantTransaction[]>({endpoint,});

  const getMerchantTransactions: (
    merchantId: string,
    page?: number,
    size?: number
  ) => ApiResult<MerchantTransaction[]> = async (merchantId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<
        MerchantTransaction[]
      >(`/api/v1/internal/merchants/${merchantId}/transaction`, {
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
    merchantId: string,
    id: string
  ) => ApiResult<MerchantTransaction> = async (merchantId, id) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantTransaction>(
        `/api/v1/internal/merchants/${merchantId}/transaction/${id}`
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
    // Server pagination API
    page,
    size,
    sort,
    merchantOperators: data,
    total,
    loading,
    error,
    fetchMerchantOperators: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,


    isLoading,
    getMerchantTransactionById,
    getMerchantTransactions,
    getMerchantTransactionsCount,
    getPendingMerchantTransactionByDynamicId,
  };
};
