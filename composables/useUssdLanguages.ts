import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { UssdLanguage } from "~/types";

export const useUssdLanguages = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdLanguages: (page?: number, size?: number) => Promise<UssdLanguage[]> = async (
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
        throw new Error("No ussd languages data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUssdLanguageById: (id: string) => Promise<UssdLanguage> = async (id) => {
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
        throw new Error("No ussd language with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUssdLanguage: (ussdLanguageData: any) => Promise<UssdLanguage> = async (ussdLanguageData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log("Creating new ussd language error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new ussd language error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new ussd language errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No ussd language received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdLanguageStatus: (ussdLanguageId: string, ussdLanguageStatus: any) => Promise<UssdLanguage> = async (
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
            "Updating ussd language error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log("Updating ussd language errorrr: ", error.value?.data?.message);
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No ussd language with this ussd language id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUssdLanguage: (ussdLanguageId: string) => Promise<UssdLanguage> = async (ussdLanguageId) => {
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
            "Deleting ussd language error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Deleting ussd language errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No ussd language with this ussd language id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
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
