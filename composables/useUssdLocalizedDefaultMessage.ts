import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type {
  DefaultMessage,
  LocalizedDefaultMessage,
  LocalizedUssdMenu,
} from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUssdLocalizedDefaultMessage = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdLocalizedDefaultMessages: (
    page?: number,
    size?: number
  ) => ApiResult<LocalizedDefaultMessage[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<
        LocalizedDefaultMessage[]
      >(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-messages/by-language`,
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
      handleApiError(err);
      return null;
    }
  };

  const getUssdLocalizedDefaultMessageById: (
    id: string
  ) => ApiResult<LocalizedDefaultMessage> = async (id) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-messages/${id}`,
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
      handleApiError(err);
      return null;
    }
  };

  const createNewUssdLocalizedDefaultMessage: (
    defaultMessageData: any
  ) => ApiResult<LocalizedDefaultMessage> = async (defaultMessageData) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-messages`,
          {
            method: "POST",
            // headers: {
            //   Authorization: `Bearer ${store.accessToken}`,
            // },
            body: JSON.stringify(defaultMessageData),
          }
        );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateUssdLocalizedDefaultMessage: (
    defaultMessageId: string,
    defaultMessageData: any
  ) => ApiResult<LocalizedDefaultMessage> = async (
    defaultMessageId,
    defaultMessageData
  ) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-messages/edit-localized-messages/${defaultMessageId}`,
          {
            method: "PUT",
            // headers: {
            //   Authorization: `Bearer ${store.accessToken}`,
            // },
            body: JSON.stringify(defaultMessageData),
          }
        );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateUssdLocalizedDefaultMessageStatus: (
    id: string,
    status: string
  ) => ApiResult<LocalizedDefaultMessage> = async (id, status) => {
    try {
      const {
        data,
        pending,
        error,
        status: statusCode,
      } = await useFetch<LocalizedDefaultMessage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-messages/${id}/${status}`,
        {
          method: "PUT",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isSubmitting.value = pending.value;

      if (statusCode.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteUssdLocalizedDefaultMessage: (
    defaultMessageId: string
  ) => ApiResult<LocalizedDefaultMessage> = async (defaultMessageId) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-messages/${defaultMessageId}`,
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
      handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    getUssdLocalizedDefaultMessages,
    getUssdLocalizedDefaultMessageById,
    createNewUssdLocalizedDefaultMessage,
    updateUssdLocalizedDefaultMessage,
    deleteUssdLocalizedDefaultMessage,
    updateUssdLocalizedDefaultMessageStatus,
    isSubmitting,
  };
};
