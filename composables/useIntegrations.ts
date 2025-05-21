import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { ApiIntegration, ApiOperation } from "~/types";

export const useIntegrations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getIntegrations: (page?: number, size?: number) => Promise<ApiIntegration[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration[]>(
        '/api/v1/internal/api-integrations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integrations data received");
      }

      return data.value as unknown as ApiIntegration[];
    } catch (err) {
      throw err;
    }
  };

  const getIntegrationById: (id: string) => Promise<ApiIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        `/api/v1/internal/api-integrations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integration with this id received");
      }

      return data.value as unknown as ApiIntegration;
    } catch (err) {
      throw err;
    }
  };

  const createNewIntegration: (integrationData: any) => Promise<ApiIntegration> = async (integrationData) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        '/api/v1/internal/api-integrations',
        {
          method: "POST",
          body: integrationData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integration received");
      }

      return data.value as unknown as ApiIntegration;
    } catch (err) {
      throw err;
    }
  };

  const updateIntegration: (integrationId: string, integrationData: any) => Promise<ApiIntegration> = async (integrationId, integrationData) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        `/api/v1/internal/api-integrations/${integrationId}`,
        {
          method: "PATCH",
          body: integrationData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integration with this integration id received");
      }

      return data.value as unknown as ApiIntegration;
    } catch (err) {
      throw err;
    }
  };

  const deleteIntegration: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/api-integrations/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getIntegrationOperations: (integrationId: string) => Promise<ApiOperation[]> = async (integrationId) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation[]>(
        `/api/v1/internal/api-integrations/${integrationId}/api-operations`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No integration operations with this id received");
      }

      return data.value as unknown as ApiOperation[];
    } catch (err) {
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
    getIntegrationOperations,
    isSubmitting,
  };
};
