import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Permission, ServiceDefinition } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useServiceDefinitions = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getServiceDefinitions: (
    page?: number,
    size?: number
  ) => ApiResult<ServiceDefinition[]> = async (page, size) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinition[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getServiceDefinitionById: (id: string) => ApiResult<ServiceDefinition> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ServiceDefinition>(
        `/api/v1/internal/service-definitions/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinition) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getServiceDefinitionPermissions: (id: string) => ApiResult<Permission[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/service-definitions/${id}/permissions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewServiceDefinition: (
    serviceDefinitionData: any
  ) => ApiResult<ServiceDefinition> = async (serviceDefinitionData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinition) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewServiceDefinitionPermission: (
    id:string,
   permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/service-definitions/${id}/permissions`,
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
      handleApiError(err);
      return null;
    }
  };

  const deleteNewServiceDefinitionPermission: (
    id:string,
   permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/service-definitions/${id}/permissions`,
        {
          method: "DELETE",
          body: permissionsData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateServiceDefinition: (
    serviceDefinitionId: string,
    serviceDefinitionData: any
  ) => ApiResult<ServiceDefinition> = async (serviceDefinitionId, serviceDefinitionData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ServiceDefinition) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteServiceDefinition: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/service-definitions/${id}`,
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
    getServiceDefinitions,
    getServiceDefinitionById,
    createNewServiceDefinition,
    deleteServiceDefinition,
    updateServiceDefinition,
    getServiceDefinitionPermissions,
    createNewServiceDefinitionPermission,
    deleteNewServiceDefinitionPermission,
    isSubmitting,
  };
};
