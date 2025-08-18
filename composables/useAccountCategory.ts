import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { AccountCategory } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useAccountCategory = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getAccountCategories: (page?: number, size?: number) => ApiResult<AccountCategory[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<AccountCategory[]>(
        '/api/v1/internal/accounts-category',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AccountCategory[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getAccountCategoryByCode: (categoryCode: string) => ApiResult<AccountCategory> = async (categoryCode) => {
    try {
      const { data, pending, error, status } = await fetch<AccountCategory>(
        `/api/v1/internal/accounts-category/${categoryCode}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AccountCategory) : null;
    } catch (err) {
      throw err
    }
  };

  const refreshAccountCategories: () => ApiResult<AccountCategory[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AccountCategory[]>(
        '/api/v1/internal/accounts-category/refresh',
        {
          method: "POST"
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AccountCategory[]) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    getAccountCategories,
    getAccountCategoryByCode,
    refreshAccountCategories,
    isSubmitting,
  };
};