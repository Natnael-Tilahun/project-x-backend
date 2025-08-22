import { useApi } from "./useApi";
import type { Account, Merchant } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

export const useMerchants = () => {
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
  } = usePagination<Merchant>({endpoint:'/api/v1/internal/merchants',  sortValue:"businessName,asc"});

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

      await fetchData();
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

      await fetchData();
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

      await fetchData();
      return data.value;
    } catch (err) {
      throw err
    }
  };

  const addMerchantAccounts: (merchantId: string, merchantData: any) => ApiResult<any> = async (merchantId, merchantData) => {
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

      await fetchData();
      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteMerchantAccounts: (merchantId: string, merchantData: any) => ApiResult<any> = async (merchantId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${merchantId}/accounts`,
        {
          method: "DELETE",
          body: merchantData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      await fetchData();
      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    // Server pagination API
    page,
    size,
    sort,
    merchants: data,
    total,
    loading,
    error,
    fetchMerchants: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,

    // Legacy/auxiliary APIs
    isLoading,
    getMerchants,
    getMerchantById,
    createNeweMerchant,
    deleteMerchant,
    updateMerchant,
    getMerchantAccountsId,
    addMerchantAccounts,
    deleteMerchantAccounts,
    isSubmitting,
  };
};
