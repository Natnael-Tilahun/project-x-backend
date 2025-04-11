import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { DefaultMessage, Menu } from "~/types";

export const useUssdDefaultMessage = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdDefaultMessages: (page?: number, size?: number) => Promise<DefaultMessage[]> = async (
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
        throw new Error("No default messages data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUssdDefaultMessageById: (id: string) => Promise<DefaultMessage> = async (id) => {
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
        throw new Error("No default message with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUssdDefaultMessage: (defaultMessageData: any) => Promise<DefaultMessage> = async (defaultMessageData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log("Creating new default message error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new default message error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new default message errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No default message received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdDefaultMessage: (defaultMessageId: string, defaultMessageData: any) => Promise<DefaultMessage> = async (
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
            "Updating default message error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log("Updating default message errorrr: ", error.value?.data?.message);
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No default message with this default message id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUssdDefaultMessage: (
    defaultMessageId: string,
  ) => Promise<DefaultMessage | null> = async (defaultMessageId) => {
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
            "Deleting default message error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Deleting default message errorrr: ",
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
    getUssdDefaultMessages,
    getUssdDefaultMessageById,
    createNewUssdDefaultMessage,
    updateUssdDefaultMessage,
    deleteUssdDefaultMessage,
    isSubmitting,
  };
};
