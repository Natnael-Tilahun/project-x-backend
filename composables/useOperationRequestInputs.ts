import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { RequestInput } from "~/types";

export const useOperationRequestInputs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getRequestInputs: () => Promise<RequestInput[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<RequestInput[]>(
        '/api/v1/internal/request-inputs'
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
        throw new Error("No request inputs data received");
      }

      return data.value as unknown as RequestInput[];
    } catch (err) {
      throw err;
    }
  };

  const getRequestInputById: (id: string) => Promise<RequestInput> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<RequestInput>(
        `/api/v1/internal/request-inputs/${id}`
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
        throw new Error("No request input with this id received");
      }

      return data.value as unknown as RequestInput;
    } catch (err) {
      throw err;
    }
  };

  const createNewRequestInput: (requestInputData: any) => Promise<RequestInput> = async (requestInputData) => {
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
        throw new Error("No request input received");
      }

      return data.value as unknown as RequestInput;
    } catch (err) {
      throw err;
    }
  };

  const updateRequestInput: (requestInputId: string, requestInputData: any) => Promise<RequestInput> = async (requestInputId, requestInputData) => {
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
        throw new Error("No request input with this request input id received");
      }

      return data.value as unknown as RequestInput;
    } catch (err) {
      throw err;
    }
  };

  const deleteRequestInput: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/request-inputs/${id}`,
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
    getRequestInputs,
    getRequestInputById,
    createNewRequestInput,
    deleteRequestInput,
    updateRequestInput,
    isSubmitting
  };
};
