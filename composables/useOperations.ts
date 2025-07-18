import type { ApiOperation, ValidationConfig } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useOperations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getOperations: (page?: number, size?: number) => ApiResult<ApiOperation[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation[]>(
        '/api/v1/internal/api-operations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getOperationById: (id: string) => ApiResult<ApiOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewOperation: (operation: ApiOperation) => ApiResult<ApiOperation> = async (operation) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        '/api/v1/internal/api-operations',
        {
          method: "POST",
          body: operation
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation) : null;
    } catch (err) {
      throw err
    }
  };

  const updateOperation: (id: string, operation: ApiOperation) => ApiResult<ApiOperation> = async (id, operation) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}`,
        {
          method: "PATCH",
          body: operation
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteOperation: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/api-operations/${id}`,
        {
          method: "DELETE"
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const testOperation: (id: string) => ApiResult<ApiOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}/test`,
        {
          method: "POST"
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation) : null;
    } catch (err) {
      throw err
    }
  };

  const updateOperationErrorValidation: (id: string, validationConfig: ValidationConfig) => ApiResult<ApiOperation> = async (id, validationConfig) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}/error-validation`,
        {
          method: "PUT",
          body: validationConfig
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ApiOperation) : null;
    } catch (err) {
      throw err
    }
  };


  return {
    isLoading,
    getOperations,
    getOperationById,
    createNewOperation,
    deleteOperation,
    updateOperation,
    isSubmitting,
    testOperation,
    updateOperationErrorValidation,
  };
};
