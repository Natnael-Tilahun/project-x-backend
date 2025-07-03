import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useRoles = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken, getAuthorities } = useAuth();
  const { toast } = useToast();
  const { fetch } = useApi();

  const getSystemRoles: () => ApiResult<Role[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Role[]>(
        '/api/v1/internal/roles/list'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Role[]) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteSystemRoleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/roles/delete/${id}`,
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

  const getSystemRolePermissions: (name: string) => ApiResult<Role> = async (name) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/roles/${name}/permissions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        if (error.value?.statusCode == 401) {
          await getRefreshToken().catch(e => {
            console.log("refreshing token error: ", e);
            navigateTo('/login');
          });
        }
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewSystemRole: (roleDetail: Role) => ApiResult<Role> = async (roleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        '/api/v1/internal/roles/create',
        {
          method: "POST",
          body: roleDetail
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const updateSystemRolePermissions: (roleName: string, roleDetail: any) => ApiResult<Role> = async (roleName, roleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/roles/${roleName}/permissions/update`,
        {
          method: "POST",
          body: roleDetail
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      await getAuthorities();
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const updateSystemRoleStatus: (roleName: string, roleStatus: boolean) => ApiResult<Role> = async (roleName, roleStatus) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/roles/${roleName}/${roleStatus ?'disable': 'enable'}`,
        {
          method: "POST",
          // params: {
          //   action: roleStatus ? "disable" : "enable"
          // }
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      await getAuthorities();
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const createSystemRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/roles/${roleName}/permissions`,
        {
          method: "POST",
          body: permissionsData
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      await getAuthorities();
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteSystemRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/roles/${roleName}/permissions`,
        {
          method: "DELETE",
          body: permissionsData
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      await getAuthorities();
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };


  return {
    isLoading,
    isUpdating,
    getSystemRoles,
    getSystemRolePermissions,
    deleteSystemRoleById,
    createNewSystemRole,
    updateSystemRolePermissions,
    updateSystemRoleStatus,
    createSystemRolePermissions,
    deleteSystemRolePermissions
  };
};
