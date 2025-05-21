import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Form } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useForms = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getForms: () => ApiResult<Form[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Form[]>(
        '/api/v1/internal/forms'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Form[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getFormById: (id: string) => ApiResult<Form> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Form>(
        `/api/v1/internal/forms/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Form) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewForm: (formData: any) => ApiResult<Form> = async (formData) => {
    try {
      const { data, pending, error, status } = await fetch<Form>(
        '/api/v1/internal/forms',
        {
          method: "POST",
          body: formData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Form) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateForm: (formId: string, formData: any) => ApiResult<Form> = async (formId, formData) => {
    try {
      const { data, pending, error, status } = await fetch<Form>(
        `/api/v1/internal/forms/${formId}`,
        {
          method: "PATCH",
          body: formData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Form) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteForm: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/forms/${id}`,
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
    getForms,
    getFormById,
    createNewForm,
    deleteForm,
    updateForm,
    isSubmitting
  };
};
