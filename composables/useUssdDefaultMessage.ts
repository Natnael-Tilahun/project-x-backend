import type { DefaultMessage, LocalizedDefaultMessage, Menu } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUssdDefaultMessage = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const getUssdDefaultMessages: (page?: number, size?: number) => ApiResult<DefaultMessage[]> = async (
    page,
    size
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage[]>(
        `${__USSD_API_BASE_URL__}/api/v1/default-messages?page=${page}&size=${size}`,
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

  const getUssdDefaultMessageById: (id: string) => ApiResult<DefaultMessage> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${__USSD_API_BASE_URL__}/api/v1/default-messages/${id}`,
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

  const createNewUssdDefaultMessage: (defaultMessageData: any) => ApiResult<DefaultMessage> = async (defaultMessageData) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${__USSD_API_BASE_URL__}/api/v1/default-messages`,
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
      throw err
    }
  };

  const updateUssdDefaultMessage: (defaultMessageId: string, defaultMessageData: any) => ApiResult<DefaultMessage> = async (
    defaultMessageId,
    defaultMessageData
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${__USSD_API_BASE_URL__}/api/v1/default-messages/update-default-message/${defaultMessageId}`,
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
      throw err
    }
  };

  const deleteUssdDefaultMessage: (defaultMessageId: string) => ApiResult<DefaultMessage> = async (defaultMessageId) => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage>(
        `${__USSD_API_BASE_URL__}/api/v1/default-messages/${defaultMessageId}`,
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

  const cacheDefaultMessagesToRedis: () => ApiResult<DefaultMessage[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<DefaultMessage[]>(
        `${__USSD_API_BASE_URL__}/api/v1/redis/cache-toRedis-default-messages`,
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

  return {
    isLoading,
    getUssdDefaultMessages,
    getUssdDefaultMessageById,
    createNewUssdDefaultMessage,
    updateUssdDefaultMessage,
    deleteUssdDefaultMessage,
    isSubmitting,
    cacheDefaultMessagesToRedis,
  };
};
