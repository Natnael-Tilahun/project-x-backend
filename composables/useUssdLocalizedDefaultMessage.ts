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
        `${__USSD_API_BASE_URL__}/api/v1/localized-messages/by-language`,
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

  const getUssdLocalizedDefaultMessageById: (
    id: string
  ) => ApiResult<LocalizedDefaultMessage> = async (id) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-messages/${id}`,
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

  const createNewUssdLocalizedDefaultMessage: (
    defaultMessageData: any
  ) => ApiResult<LocalizedDefaultMessage> = async (defaultMessageData) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-messages`,
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
          `${__USSD_API_BASE_URL__}/api/v1/localized-messages/edit-localized-messages/${defaultMessageId}`,
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
        `${__USSD_API_BASE_URL__}/api/v1/localized-messages/${id}/${status}`,
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
      throw err
    }
  };

  const deleteUssdLocalizedDefaultMessage: (
    defaultMessageId: string
  ) => ApiResult<LocalizedDefaultMessage> = async (defaultMessageId) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedDefaultMessage>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-messages/${defaultMessageId}`,
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

  const cacheLocalizedDefaultMessagesToRedis: () => ApiResult<LocalizedDefaultMessage[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedDefaultMessage[]>(
        `${__USSD_API_BASE_URL__}/api/v1/redis/cache-toRedis-localized-messages`,
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
    getUssdLocalizedDefaultMessages,
    getUssdLocalizedDefaultMessageById,
    createNewUssdLocalizedDefaultMessage,
    updateUssdLocalizedDefaultMessage,
    deleteUssdLocalizedDefaultMessage,
    updateUssdLocalizedDefaultMessageStatus,
    isSubmitting,
    cacheLocalizedDefaultMessagesToRedis,
  };
};
