import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { UssdLanguage } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUssdLanguages = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdLanguages: (page?: number, size?: number) => ApiResult<UssdLanguage[]> = async (
    page,
    size
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdLanguage[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/language`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  const getUssdLanguageById: (id: string) => ApiResult<UssdLanguage> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdLanguage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/language/${id}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  const createNewUssdLanguage: (ussdLanguageData: any) => ApiResult<UssdLanguage> = async (ussdLanguageData) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdLanguage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/language`,
        {
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          body: JSON.stringify(ussdLanguageData),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  const updateUssdLanguageStatus: (ussdLanguageId: string, ussdLanguageStatus: any) => ApiResult<UssdLanguage> = async (
    ussdLanguageId,
    ussdLanguageStatus
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdLanguage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/language/${ussdLanguageId}/${ussdLanguageStatus}`,
        {
          method: "PUT",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          // body: JSON.stringify(ussdLanguageData),
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  const deleteUssdLanguage: (ussdLanguageId: string) => ApiResult<UssdLanguage> = async (ussdLanguageId) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdLanguage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/language/${ussdLanguageId}`,
        {
          method: "DELETE",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    getUssdLanguages,
    getUssdLanguageById,
    createNewUssdLanguage,
    updateUssdLanguageStatus,
    deleteUssdLanguage,
    isSubmitting,
  };
};
