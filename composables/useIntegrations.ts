import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useIntegrations = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getIntegrations: () => Promise<ApiIntegration[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<ApiIntegration[]>(
        `${runtimeConfig.public.API_BASE_URL}/internal/api-integrations`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integrations data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getIntegrationById: (id: string) => Promise<ApiIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiIntegration>(
        `${runtimeConfig.public.API_BASE_URL}/internal/api-integrations/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integration with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewIntegration: (integrationData: any) => Promise<ApiIntegration> = async (integrationData) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiIntegration>(
        `${runtimeConfig.public.API_BASE_URL}/internal/api-integrations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(integrationData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

        console.log("Creating new integration error: ", error.value?.data.detail)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new integration error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new integration errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No integration received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateIntegration: (integrationId: string, integrationData: any) => Promise<ApiIntegration> = async (integrationId, integrationData) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiIntegration>(
        `${runtimeConfig.public.API_BASE_URL}/internal/api-integrations/${integrationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(integrationData),
        },
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Updating integration error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating integration errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No integration with this integration id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteIntegration: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/internal/api-integrations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting integration error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };


  return {
    isLoading,
    getIntegrations,
    getIntegrationById,
    createNewIntegration,
    deleteIntegration,
    updateIntegration,
    isSubmitting
  };
};
