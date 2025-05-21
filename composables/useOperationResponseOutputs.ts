import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { ResponseOutput } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useOperationResponseOutputs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getResponseOutputs: () => ApiResult<ResponseOutput[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<ResponseOutput[]>(
        '/api/v1/internal/response-outputs'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ResponseOutput[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getResponseOutputById: (id: string) => ApiResult<ResponseOutput> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ResponseOutput>(
        `/api/v1/internal/response-outputs/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ResponseOutput) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewResponseOutput: (responseOutputData: any) => ApiResult<ResponseOutput> = async (responseOutputData) => {
    try {
      const { data, pending, error, status } = await fetch<ResponseOutput>(
        '/api/v1/internal/response-outputs',
        {
          method: "POST",
          body: responseOutputData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ResponseOutput) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateResponseOutput: (responseOutputId: string, responseOutputData: any) => ApiResult<ResponseOutput> = async (responseOutputId, responseOutputData) => {
    try {
      const { data, pending, error, status } = await fetch<ResponseOutput>(
        `/api/v1/internal/response-outputs/${responseOutputId}`,
        {
          method: "PATCH",
          body: responseOutputData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ResponseOutput) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteResponseOutput: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/response-outputs/${id}`,
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

  return {
    isLoading,
    getResponseOutputs,
    getResponseOutputById,
    createNewResponseOutput,
    deleteResponseOutput,
    updateResponseOutput,
    isSubmitting
  };
};
