import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { ResponseOutput } from "~/types";

export const useOperationResponseOutputs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getResponseOutputs: () => Promise<ResponseOutput[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<ResponseOutput[]>(
        '/api/v1/internal/response-outputs'
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
        throw new Error("No response outputs data received");
      }

      return data.value as unknown as ResponseOutput[];
    } catch (err) {
      throw err;
    }
  };

  const getResponseOutputById: (id: string) => Promise<ResponseOutput> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ResponseOutput>(
        `/api/v1/internal/response-outputs/${id}`
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
        throw new Error("No response output with this id received");
      }

      return data.value as unknown as ResponseOutput;
    } catch (err) {
      throw err;
    }
  };

  const createNewResponseOutput: (responseOutputData: any) => Promise<ResponseOutput> = async (responseOutputData) => {
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
        throw new Error("No response output received");
      }

      return data.value as unknown as ResponseOutput;
    } catch (err) {
      throw err;
    }
  };

  const updateResponseOutput: (responseOutputId: string, responseOutputData: any) => Promise<ResponseOutput> = async (responseOutputId, responseOutputData) => {
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
        throw new Error("No response output with this response output id received");
      }

      return data.value as unknown as ResponseOutput;
    } catch (err) {
      throw err;
    }
  };

  const deleteResponseOutput: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/response-outputs/${id}`,
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
    getResponseOutputs,
    getResponseOutputById,
    createNewResponseOutput,
    deleteResponseOutput,
    updateResponseOutput,
    isSubmitting
  };
};
