import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Field } from "~/types";

export const useFields = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getFields: () => Promise<Field[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Field[]>(
        '/api/v1/internal/fields'
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
        throw new Error("No fields data received");
      }

      return data.value as unknown as Field[];
    } catch (err) {
      throw err;
    }
  };

  const getFieldById: (id: string) => Promise<Field> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Field>(
        `/api/v1/internal/fields/${id}`
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
        throw new Error("No field with this id received");
      }

      return data.value as unknown as Field;
    } catch (err) {
      throw err;
    }
  };

  const createNewField: (fieldData: any) => Promise<Field> = async (fieldData) => {
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
        throw new Error("No field received");
      }

      return data.value as unknown as Field;
    } catch (err) {
      throw err;
    }
  };

  const updateField: (fieldId: string, fieldData: any) => Promise<Field> = async (fieldId, fieldData) => {
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
        throw new Error("No field with this field id received");
      }

      return data.value as unknown as Field;
    } catch (err) {
      throw err;
    }
  };

  const deleteField: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/fields/${id}`,
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
    getFields,
    getFieldById,
    createNewField,
    deleteField,
    updateField,
    isSubmitting
  };
};
