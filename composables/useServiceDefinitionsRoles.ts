import type { Permission, ServiceDefinitionRole } from "~/types";
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
      throw err
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
      throw err
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
      throw err
    }
  };

  const createNewServiceDefinitionRole: (
    serviceDefinitionRoleData: any
  ) => ApiResult<ServiceDefinitionRole> = async (serviceDefinitionRoleData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        '/api/v1/internal/service-definition-roles/create',
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
      throw err
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
      throw err
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
          method: "POST",
          body: permissionsData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteServiceDefinitionRolePermissions: (
    serviceDefinitionRoleId: string,
    permissionsData: any
  ) => ApiResult<ServiceDefinitionRole> = async (serviceDefinitionRoleId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinitionRole>(
        `/api/v1/internal/service-definition-roles/${serviceDefinitionRoleId}/permissions`,
        {
          method: "DELETE",
          body: permissionsData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinitionRole) : null;
    } catch (err) {
      throw err
    }
  };

  const setDefaultServiceDefinitionRole: (
    serviceDefinitionId: string,
    serviceDefinitionRoleId: any
  ) => ApiResult<any> = async (serviceDefinitionId, serviceDefinitionRoleId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/service-definition-roles/service-definitions/${serviceDefinitionId}/roles/${serviceDefinitionRoleId}/set-default`,
        {
          method: "POST",
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      throw err
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
      throw err
    }
  };

  const getServiceDefinitionRolePermissions: (id: string) => ApiResult<Permission[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/service-definition-roles/${id}/permissions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewServiceDefinitionRolePermission: (
    id:string,
   permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/service-definition-roles/${id}/permissions`,
        {
          method: "POST",
          body: permissionsData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err
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
    setDefaultServiceDefinitionRole,
    deleteServiceDefinitionRolePermissions,
    getServiceDefinitionRolePermissions,
    createNewServiceDefinitionRolePermission,
    isSubmitting,
  };
};
