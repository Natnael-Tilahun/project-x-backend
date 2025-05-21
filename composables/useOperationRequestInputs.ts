import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { RequestInput } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useOperationRequestInputs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getRequestInputs: () => ApiResult<RequestInput[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<RequestInput[]>(
        '/api/v1/internal/request-inputs'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as RequestInput[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getRequestInputById: (id: string) => ApiResult<RequestInput> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<RequestInput>(
        `/api/v1/internal/request-inputs/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as RequestInput) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewRequestInput: (requestInputData: any) => ApiResult<RequestInput> = async (requestInputData) => {
    try {
      const { data, pending, error, status } = await fetch<RequestInput>(
        '/api/v1/internal/request-inputs',
        {
          method: "POST",
          body: requestInputData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as RequestInput) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateRequestInput: (requestInputId: string, requestInputData: any) => ApiResult<RequestInput> = async (requestInputId, requestInputData) => {
    try {
      const { data, pending, error, status } = await fetch<RequestInput>(
        `/api/v1/internal/request-inputs/${requestInputId}`,
        {
          method: "PATCH",
          body: requestInputData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as RequestInput) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteRequestInput: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/request-inputs/${id}`,
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
    getRequestInputs,
    getRequestInputById,
    createNewRequestInput,
    deleteRequestInput,
    updateRequestInput,
    isSubmitting
  };
};
