import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { AuthConfiguration } from "~/types";

export const useAuthConfigs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getAuthConfigs: () => Promise<AuthConfiguration[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration[]>(
        '/api/v1/internal/auth-configs'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No auth configs data received");
      }

      return data.value as unknown as AuthConfiguration[];
    } catch (err) {
      throw err;
    }
  };

  const getAuthConfigById: (id: string) => Promise<AuthConfiguration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration>(
        `/api/v1/internal/auth-configs/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No auth config with this id received");
      }

      return data.value as unknown as AuthConfiguration;
    } catch (err) {
      throw err;
    }
  };

  const createNewAuthConfig: (authConfigData: any) => Promise<AuthConfiguration> = async (authConfigData) => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration>(
        '/api/v1/internal/auth-configs',
        {
          method: "POST",
          body: authConfigData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No auth config received");
      }

      return data.value as unknown as AuthConfiguration;
    } catch (err) {
      throw err;
    }
  };

  const updateAuthConfig: (authConfigId: string, authConfigData: any) => Promise<AuthConfiguration> = async (authConfigId, authConfigData) => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration>(
        `/api/v1/internal/auth-configs/${authConfigId}`,
        {
          method: "PATCH",
          body: authConfigData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No auth config with this auth config id received");
      }

      return data.value as unknown as AuthConfiguration;
    } catch (err) {
      throw err;
    }
  };

  const deleteAuthConfig: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/auth-configs/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
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
