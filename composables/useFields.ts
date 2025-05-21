import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Field } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useFields = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getFields: () => ApiResult<Field[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Field[]>(
        '/api/v1/internal/fields'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Field[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getFieldById: (id: string) => ApiResult<Field> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Field>(
        `/api/v1/internal/fields/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Field) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewField: (fieldData: any) => ApiResult<Field> = async (fieldData) => {
    try {
      const { data, pending, error, status } = await fetch<Field>(
        '/api/v1/internal/fields',
        {
          method: "POST",
          body: fieldData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Field) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateField: (fieldId: string, fieldData: any) => ApiResult<Field> = async (fieldId, fieldData) => {
    try {
      const { data, pending, error, status } = await fetch<Field>(
        `/api/v1/internal/fields/${fieldId}`,
        {
          method: "PATCH",
          body: fieldData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Field) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteField: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/fields/${id}`,
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
    getFields,
    getFieldById,
    createNewField,
    deleteField,
    updateField,
    isSubmitting
  };
};
