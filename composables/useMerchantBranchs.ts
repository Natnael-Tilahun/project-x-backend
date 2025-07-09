import { useApi } from "./useApi";
import type { MerchantBranch } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchantBranchs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getMerchantBranches: (merchantId: string, page?: number, size?: number) => ApiResult<MerchantBranch[]> = async (merchantId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantBranch[]>(
        `/api/v1/internal/merchant-branches/merchant/${merchantId}`,
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantBranch[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getMerchantBranchById: (id: string) => ApiResult<MerchantBranch> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantBranch>(
        `/api/v1/internal/merchant-branches/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantBranch) : null;
    } catch (err) {
      throw err
    }
  };

  const createNeweMerchantBranch: (merchantId: string, merchantData: any) => ApiResult<MerchantBranch> = async ( merchantId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantBranch>(
        `/api/v1/internal/merchant-branches/${merchantId}`,
        {
          method: "POST",
          body: merchantData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantBranch) : null;
    } catch (err) {
      throw err
    }
  };

  const updateMerchantBranch: (branchId: string, branchData: any) => ApiResult<MerchantBranch> = async (branchId, branchData) => {
    try {
      const { data, pending, error, status } = await fetch<MerchantBranch>(
        `/api/v1/internal/merchant-branches/${branchId}`,
        {
          method: "PATCH",
          body: branchData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as MerchantBranch) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteMerchantBranch: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchant-branches/${id}`,
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
    getMerchantBranches,
    getMerchantBranchById,
    createNeweMerchantBranch,
    updateMerchantBranch,
    deleteMerchantBranch,
    isSubmitting,
  };
};