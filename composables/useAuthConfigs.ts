import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useAuthConfigs = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getAuthConfigs: () => Promise<AuthConfiguration[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<AuthConfiguration[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/auth-configs`,
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
        throw new Error("No auth configs data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getAuthConfigById: (id: string) => Promise<AuthConfiguration> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<AuthConfiguration>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/auth-configs/${id}`,
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
        throw new Error("No auth config with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewAuthConfig: (authConfigData: any) => Promise<AuthConfiguration> = async (authConfigData) => {
    try {
      const { data, pending, error, status } = await useFetch<AuthConfiguration>(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/auth-configs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(authConfigData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

        console.log("Creating new auth config error: ", error.value?.data.detail)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new auth config error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new auth config errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No auth config received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateAuthConfig: (authConfigId: string, authConfigData: any) => Promise<AuthConfiguration> = async (authConfigId, authConfigData) => {
    try {
      const { data, pending, error, status } = await useFetch<AuthConfiguration>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/auth-configs/${authConfigId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(authConfigData),
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
          console.log("Updating auth config error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating auth config errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No auth config with this auth config id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteAuthConfig: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/auth-configs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting auth config error: ", error.value?.data?.message)
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
    getAuthConfigs,
    getAuthConfigById,
    createNewAuthConfig,
    deleteAuthConfig,
    updateAuthConfig,
    isSubmitting
  };
};
