import { toast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { ServiceDefinitionRole } from "~/types";
import { ServiceDefinitionStatus } from "~/global-types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useServiceDefinitionsRoles = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getServiceDefinitionsRoles: (
    page?: number,
    size?: number
  ) => ApiResult<ServiceDefinitionRole[]> = async (page, size) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getServiceDefinitionRoleById: (id: string) => ApiResult<ServiceDefinitionRole> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        `/api/v1/internal/service-definition-roles/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getServiceDefinitionRolesByServiceDefinitionId: (
    ServiceDefinitionId: string,
    page?: number,
    size?: number
  ) => ApiResult<ServiceDefinitionRole[]> = async (ServiceDefinitionId, page, size) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewServiceDefinitionRole: (
    serviceDefinitionRoleData: any
  ) => ApiResult<ServiceDefinitionRole> = async (serviceDefinitionRoleData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateServiceDefinitionRole: (
    serviceDefinitionRoleId: string,
    serviceDefinitionRoleData: any
  ) => ApiResult<ServiceDefinitionRole> = async (serviceDefinitionRoleId, serviceDefinitionRoleData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateServiceDefinitionRolePermissions: (
    serviceDefinitionRoleId: string,
    permissionsData: any
  ) => ApiResult<ServiceDefinitionRole> = async (serviceDefinitionRoleId, permissionsData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteServiceDefinitionRole: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/service-definition-roles/${id}`,
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
