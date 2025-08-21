import { useApi } from "./useApi";
import type { ApiIntegration, ApiOperation } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import axios from "axios";

export const useIntegrations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const {
    page,
    size,
    sort,
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
  } = usePagination<ApiIntegration>({endpoint:'/api/v1/internal/api-integrations', sortValue: 'name,asc'});

  onSortChange('name,asc')

  const getIntegrations: (
    page?: number,
    size?: number
  ) => ApiResult<ApiIntegration[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration[]>(
        "/api/v1/internal/api-integrations",
        {
          params: { page, size },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getIntegrationById: (id: string) => ApiResult<ApiIntegration> = async (
    id
  ) => {
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
      throw err;
    }
  };

  const createNewIntegration: (
    integrationData: any
  ) => ApiResult<ApiIntegration> = async (integrationData) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        "/api/v1/internal/api-integrations",
        {
          method: "POST",
          body: integrationData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      throw err;
    }
  };

  const updateIntegration: (
    integrationId: string,
    integrationData: any
  ) => ApiResult<ApiIntegration> = async (integrationId, integrationData) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        `/api/v1/internal/api-integrations/${integrationId}`,
        {
          method: "PATCH",
          body: integrationData,
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      throw err;
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
      throw err;
    }
  };

  const getIntegrationOperations: (
    integrationId: string
  ) => ApiResult<ApiOperation[]> = async (integrationId) => {
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
      throw err;
    }
  };

  const importIntegration: (
    formData: FormData,
    options?: { onUploadProgress?: (progressEvent: any) => void }
  ) => ApiResult<ApiIntegration> = async (formData, options) => {
    try {
      if (options && options.onUploadProgress) {
        const runtimeConfig = useRuntimeConfig();
        const { getHeaders } = useApi();
        // Use axios for upload progress
        try {
          const response = await axios.post<ApiIntegration>(
            `${__API_BASE_URL__}/api/v1/internal/api-integrations/import-bulk`,
            formData,
            {
              headers: {
                ...getHeaders(true),
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: options.onUploadProgress,
            }
          );
          return response.data as unknown as ApiIntegration;
        } catch (error: any) {
          throw error;
        }
      }
      // Default: use fetch
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        "/api/v1/internal/payment-integrations/import-bulk",
        {
          method: "POST",
          body: formData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      throw err;
    }
  };

  const exportIntegration: (id: string) => ApiResult<ApiIntegration> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<ApiIntegration>(
        `/api/v1/internal/api-integrations/${id}/export`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiIntegration) : null;
    } catch (err) {
      throw err;
    }
  };

  return {
    // Server pagination API
    page,
    size,
    sort,
    integrations: data,
    total,
    loading,
    error,
    fetchIntegrations: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,

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
