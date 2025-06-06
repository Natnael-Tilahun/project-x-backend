import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { DefaultMessage, Menu } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUssdDefaultMessage = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdDefaultMessages: (page?: number, size?: number) => ApiResult<DefaultMessage[]> = async (
    page,
    size
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/default-messages?page=${page}&size=${size}`,
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

  const getUssdDefaultMessageById: (id: string) => ApiResult<DefaultMessage> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/default-messages/${id}`,
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

  const createNewUssdDefaultMessage: (defaultMessageData: any) => ApiResult<DefaultMessage> = async (defaultMessageData) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/default-messages`,
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

  const updateUssdDefaultMessage: (defaultMessageId: string, defaultMessageData: any) => ApiResult<DefaultMessage> = async (
    defaultMessageId,
    defaultMessageData
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/default-messages/update-default-message/${defaultMessageId}`,
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

  const deleteUssdDefaultMessage: (defaultMessageId: string) => ApiResult<DefaultMessage> = async (defaultMessageId) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/default-messages/${defaultMessageId}`,
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
    getUssdDefaultMessages,
    getUssdDefaultMessageById,
    createNewUssdDefaultMessage,
    updateUssdDefaultMessage,
    deleteUssdDefaultMessage,
    isSubmitting,
  };
};
