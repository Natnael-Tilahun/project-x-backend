import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { ApiOperation } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useOperations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
  };
};
