import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Form } from "~/types";

export const useForms = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getForms: () => Promise<Form[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Form[]>(
        '/api/v1/internal/forms'
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
        throw new Error("No forms data received");
      }

      return data.value as unknown as Form[];
    } catch (err) {
      throw err;
    }
  };

  const getFormById: (id: string) => Promise<Form> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Form>(
        `/api/v1/internal/forms/${id}`
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
        throw new Error("No form with this id received");
      }

      return data.value as unknown as Form;
    } catch (err) {
      throw err;
    }
  };

  const createNewForm: (formData: any) => Promise<Form> = async (formData) => {
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
        throw new Error("No form received");
      }

      return data.value as unknown as Form;
    } catch (err) {
      throw err;
    }
  };

  const updateForm: (formId: string, formData: any) => Promise<Form> = async (formId, formData) => {
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
        throw new Error("No form with this form id received");
      }

      return data.value as unknown as Form;
    } catch (err) {
      throw err;
    }
  };

  const deleteForm: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/forms/${id}`,
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
    getForms,
    getFormById,
    createNewForm,
    deleteForm,
    updateForm,
    isSubmitting
  };
};
