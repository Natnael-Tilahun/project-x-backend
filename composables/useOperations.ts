import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { ApiOperation } from "~/types";
import { useApi } from "./useApi";

export const useOperations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getOperations: (page?: number, size?: number) => Promise<ApiOperation[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation[]>(
        '/api/v1/internal/api-operations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operations data received");
      }

      return data.value as unknown as ApiOperation[];
    } catch (err) {
      throw err;
    }
  };

  const getOperationById: (id: string) => Promise<ApiOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operation with this id received");
      }

      return data.value as unknown as ApiOperation;
    } catch (err) {
      throw err;
    }
  };

  const createNewOperation: (operation: ApiOperation) => Promise<ApiOperation> = async (operation) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operation data received");
      }

      return data.value as unknown as ApiOperation;
    } catch (err) {
      throw err;
    }
  };

  const updateOperation: (id: string, operation: ApiOperation) => Promise<ApiOperation> = async (id, operation) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}`,
        {
          method: "PUT",
          body: operation
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operation data received");
      }

      return data.value as unknown as ApiOperation;
    } catch (err) {
      throw err;
    }
  };

  const deleteOperation: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/api-operations/${id}`,
        {
          method: "DELETE"
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const testOperation: (id: string) => Promise<ApiOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ApiOperation>(
        `/api/v1/internal/api-operations/${id}/test`,
        {
          method: "POST"
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operation with this id received");
      }

      return data.value as unknown as ApiOperation;
    } catch (err) {
      throw err;
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
