import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { ApiIntegration, ApiOperation } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useIntegrations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const runtimeConfig = useRuntimeConfig();
  const { fetch } = useApi();

  const getIntegrations: (page?: number, size?: number) => ApiResult<ApiIntegration[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration[]>(
        '/api/v1/internal/api-integrations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getIntegrationById: (id: string) => ApiResult<ApiIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        `/api/v1/internal/api-integrations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewIntegration: (integrationData: any) => ApiResult<ApiIntegration> = async (integrationData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateIntegration: (integrationId: string, integrationData: any) => ApiResult<ApiIntegration> = async (integrationId, integrationData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteIntegration: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/api-integrations/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getIntegrationOperations: (integrationId: string) => ApiResult<ApiOperation[]> = async (integrationId) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation[]>(
        `/api/v1/internal/api-integrations/${integrationId}/api-operations`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };


  const importIntegration: (integrationData: any) => ApiResult<ApiIntegration> = async (integrationData) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        '/api/v1/internal/api-integrations/import',
        {
          method: "POST",
          body: integrationData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const exportIntegration: (id:string) => ApiResult<ApiIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        `/api/v1/internal/api-integrations/${id}/export`,
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
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
    importIntegration,
    exportIntegration,
    isSubmitting,
  };
};
