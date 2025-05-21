import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { ServiceDefinition } from "~/types";
import { useApi } from "./useApi";

export const useServiceDefinitions = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getServiceDefinitions: (
    page?: number,
    size?: number
  ) => Promise<ServiceDefinition[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinition[]>(
        '/api/v1/internal/service-definitions',
        {
          params: {
            page,
            size
          }
        }
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
        throw new Error("No service definitions data received");
      }

      return data.value as unknown as ServiceDefinition[];
    } catch (err) {
      throw err;
    }
  };

  const getServiceDefinitionById: (id: string) => Promise<ServiceDefinition> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinition>(
        `/api/v1/internal/service-definitions/${id}`
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
        throw new Error("No service definition with this id received");
      }

      return data.value as unknown as ServiceDefinition;
    } catch (err) {
      throw err;
    }
  };

  const createNewServiceDefinition: (
    serviceDefinitionData: any
  ) => Promise<ServiceDefinition> = async (serviceDefinitionData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinition>(
        '/api/v1/internal/service-definitions',
        {
          method: "POST",
          body: serviceDefinitionData
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
        throw new Error("No service definition with this id received");
      }

      return data.value as unknown as ServiceDefinition;
    } catch (err) {
      throw err;
    }
  };

  const updateServiceDefinition: (
    serviceDefinitionId: string,
    serviceDefinitionData: any
  ) => Promise<ServiceDefinition> = async (serviceDefinitionId, serviceDefinitionData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinition>(
        `/api/v1/internal/service-definitions/${serviceDefinitionId}`,
        {
          method: "PATCH",
          body: serviceDefinitionData
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
        throw new Error("No service definition with this service definition id received");
      }

      return data.value as unknown as ServiceDefinition;
    } catch (err) {
      throw err;
    }
  };

  const deleteServiceDefinition: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/service-definitions/${id}`,
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
    getServiceDefinitions,
    getServiceDefinitionById,
    createNewServiceDefinition,
    deleteServiceDefinition,
    updateServiceDefinition,
    isSubmitting,
  };
};
