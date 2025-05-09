import { toast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { ServiceDefinitionRole } from "~/types";
import { ServiceDefinitionStatus } from "~/global-types";

export const useServiceDefinitionsRoles = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getServiceDefinitionsRoles: (
    page?: number,
    size?: number
  ) => Promise<ServiceDefinitionRole[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<ServiceDefinitionRole[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles?page=${page}&size=${size}`,
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
        throw new Error("No service definitions roles data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getServiceDefinitionRoleById: (id: string) => Promise<ServiceDefinitionRole> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ServiceDefinitionRole>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles/${id}`,
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
        throw new Error("No service definition role with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getServiceDefinitionRolesByServiceDefinitionId: (ServiceDefinitionId: string,
    page?: number,
    size?: number
   ) => Promise<ServiceDefinitionRole[]> = async (ServiceDefinitionId, page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<ServiceDefinitionRole[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles/service-definition/${ServiceDefinitionId}?page=${page}&size=${size}`,
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
        throw new Error("No service definition role with this service definition id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };


  const createNewServiceDefinitionRole: (
    serviceDefinitionRoleData: any
  ) => Promise<ServiceDefinitionRole> = async (serviceDefinitionRoleData) => {
    try {
      const { data, pending, error, status } = await useFetch<ServiceDefinitionRole>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(serviceDefinitionRoleData),
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

        console.log("Creating new service definition role error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new service definition role error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new service definition role errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No service definition role with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateServiceDefinitionRole: (
    serviceDefinitionRoleId: string,
    serviceDefinitionRoleData: any
  ) => Promise<ServiceDefinitionRole> = async (serviceDefinitionRoleId, serviceDefinitionRoleData) => {
    try {
      const { data, pending, error, status } = await useFetch<ServiceDefinitionRole>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles/${serviceDefinitionRoleId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(serviceDefinitionRoleData),
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
            "Updating service definition role error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating service definition role errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No service definition role with this service definition role id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateServiceDefinitionRolePermissions: (
    serviceDefinitionRoleId: string,
    permissionsData: any
  ) => Promise<ServiceDefinitionRole> = async (serviceDefinitionRoleId, permissionsData) => {
    try {
      const { data, pending, error, status } = await useFetch<ServiceDefinitionRole>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles/${serviceDefinitionRoleId}/permissions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(permissionsData),
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
            "Updating service definition role permissions error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating service definition role permission errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No service definition role with this service definition role id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteServiceDefinitionRole: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/service-definition-roles/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting service definition role error: ", error.value?.data?.message);
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
