import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { AccountCategory } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

export const useAccountCategory = () => {
  const { page, size, sort, data, total, loading, error, fetchData, onPageChange, onSizeChange, onSortChange } = usePagination<AccountCategory>({endpoint: '/api/v1/internal/accounts-category', sortValue: "categoryCode,asc"});

  const isLoading = ref<boolean>(false); // Keep existing isLoading if it's used elsewhere
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

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
    isSubmitting,
    accountCategories: data, // Renamed for clarity
    total,
    loading,
    error,
    fetchAccountCategories: fetchData, // Renamed for clarity
    getAccountCategoryByCode,
    refreshAccountCategories,
    onPageChange,
    onSizeChange,
    onSortChange,
    page,
    size,
    sort,
  };
};