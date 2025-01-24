import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useOperations = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getOperations: (
    page?: number,
    size?: number
  ) => Promise<ApiOperation[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiOperation[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-operations?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operations data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getOperationById: (id: string) => Promise<ApiOperation> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-operations/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operation with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewOperation: (
    operationData: any
  ) => Promise<ApiOperation> = async (operationData) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-operations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(operationData),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log("Creating new operation error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new operation error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new operation errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No operation received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateOperation: (
    operationId: string,
    operationData: any
  ) => Promise<ApiOperation> = async (operationId, operationData) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-operations/${operationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(operationData),
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Updating operation error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating operation errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No operation with this operation id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteOperation: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-operations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting operation error: ", error.value?.data?.message);
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const testOperation: (id: string) => Promise<ApiOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ApiOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/api-operations/${id}/test`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No operation with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
