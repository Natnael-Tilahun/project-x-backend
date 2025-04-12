import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type {
  DefaultMessage,
  LocalizedDefaultMessage,
  LocalizedUssdMenu,
} from "~/types";

export const useUssdLocalizedDefaultMessage = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdLocalizedDefaultMessages: (
    page?: number,
    size?: number
  ) => Promise<LocalizedDefaultMessage[]> = async (page, size) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No localized default messages data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUssdLocalizedDefaultMessageById: (
    id: string
  ) => Promise<LocalizedDefaultMessage> = async (id) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No localized default message with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUssdLocalizedDefaultMessage: (
    defaultMessageData: any
  ) => Promise<LocalizedDefaultMessage> = async (defaultMessageData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log(
          "Creating new localized default message error: ",
          error.value?.data.detail
        );

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new localized default message error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new localized default message errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No localized default message received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdLocalizedDefaultMessage: (
    defaultMessageId: string,
    defaultMessageData: any
  ) => Promise<LocalizedDefaultMessage> = async (
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Updating localized default message error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating localized default message errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error(
          "No localized default message with this default message id received"
        );
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdLocalizedDefaultMessageStatus: (
    id: string,
    status: string
  ) => Promise<LocalizedDefaultMessage> = async (id, status) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Updating ussd localized default message status error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating ussd localized default message status errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No ussd localized default message status received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUssdLocalizedDefaultMessage: (
    defaultMessageId: string
  ) => Promise<LocalizedDefaultMessage | null> = async (defaultMessageId) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Deleting localized default message error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Deleting localized default message errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
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
