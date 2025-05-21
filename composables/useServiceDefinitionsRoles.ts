import { toast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { ServiceDefinitionRole } from "~/types";
import { ServiceDefinitionStatus } from "~/global-types";
import { useApi } from "./useApi";

export const useServiceDefinitionsRoles = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getServiceDefinitionsRoles: (
    page?: number,
    size?: number
  ) => Promise<ServiceDefinitionRole[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole[]>(
        '/api/v1/internal/service-definition-roles',
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
        throw new Error("No service definitions roles data received");
      }

      return data.value as unknown as ServiceDefinitionRole[];
    } catch (err) {
      throw err;
    }
  };

  const getServiceDefinitionRoleById: (id: string) => Promise<ServiceDefinitionRole> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        `/api/v1/internal/service-definition-roles/${id}`
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
        throw new Error("No service definition role with this id received");
      }

      return data.value as unknown as ServiceDefinitionRole;
    } catch (err) {
      throw err;
    }
  };

  const getServiceDefinitionRolesByServiceDefinitionId: (
    ServiceDefinitionId: string,
    page?: number,
    size?: number
  ) => Promise<ServiceDefinitionRole[]> = async (ServiceDefinitionId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole[]>(
        `/api/v1/internal/service-definition-roles/service-definition/${ServiceDefinitionId}`,
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
        throw new Error("No service definition role with this service definition id received");
      }

      return data.value as unknown as ServiceDefinitionRole[];
    } catch (err) {
      throw err;
    }
  };

  const createNewServiceDefinitionRole: (
    serviceDefinitionRoleData: any
  ) => Promise<ServiceDefinitionRole> = async (serviceDefinitionRoleData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        '/api/v1/internal/service-definition-roles',
        {
          method: "POST",
          body: serviceDefinitionRoleData
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
        throw new Error("No service definition role with this id received");
      }

      return data.value as unknown as ServiceDefinitionRole;
    } catch (err) {
      throw err;
    }
  };

  const updateServiceDefinitionRole: (
    serviceDefinitionRoleId: string,
    serviceDefinitionRoleData: any
  ) => Promise<ServiceDefinitionRole> = async (serviceDefinitionRoleId, serviceDefinitionRoleData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        `/api/v1/internal/service-definition-roles/${serviceDefinitionRoleId}`,
        {
          method: "PATCH",
          body: serviceDefinitionRoleData
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
        throw new Error("No service definition role with this service definition role id received");
      }

      return data.value as unknown as ServiceDefinitionRole;
    } catch (err) {
      throw err;
    }
  };

  const updateServiceDefinitionRolePermissions: (
    serviceDefinitionRoleId: string,
    permissionsData: any
  ) => Promise<ServiceDefinitionRole> = async (serviceDefinitionRoleId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        `/api/v1/internal/service-definition-roles/${serviceDefinitionRoleId}/permissions`,
        {
          method: "PUT",
          body: permissionsData
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
        throw new Error("No service definition role with this service definition role id received");
      }

      return data.value as unknown as ServiceDefinitionRole;
    } catch (err) {
      throw err;
    }
  };

  const deleteServiceDefinitionRole: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/service-definition-roles/${id}`,
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
    getServiceDefinitionsRoles,
    getServiceDefinitionRoleById,
    createNewServiceDefinitionRole,
    deleteServiceDefinitionRole,
    updateServiceDefinitionRole,
    updateServiceDefinitionRolePermissions,
    getServiceDefinitionRolesByServiceDefinitionId,
    isSubmitting,
  };
};
