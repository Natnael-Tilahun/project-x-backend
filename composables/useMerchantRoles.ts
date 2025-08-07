import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useMerchantRoles = () => {
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken, getAuthorities } = useAuth();
  const { fetch } = useApi();

  const getMerchantOperatorRoles: () => ApiResult<Role[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Role[]>(
        '/api/v1/internal/merchants/operator-roles'
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

  const deleteMerchantOperatorRoleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchants/operator-roles/${id}`,
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

  const getMerchantOperatorRoleById: (name: string) => ApiResult<Role> = async (name) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/merchants/operator-roles/${name}`
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

  const getMerchantOperatorRolePermissions: (name: string) => ApiResult<Role> = async (name) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/merchants/operator-roles/${name}/permissions`
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

  const createNewMerchantOperatorRole: (roleDetail: Role) => ApiResult<Role> = async (roleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        '/api/v1/internal/merchants/operator-roles',
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

  const updateMerchantOperatorRole: (roleName: string, roleDetail: any) => ApiResult<Role> = async (roleName, roleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/merchants/operator-roles/${roleName}`,
        {
          method: "PATCH",
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

  const createMerchantOperatorRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/merchants/operator-roles/${roleName}/permissions`,
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

  const deleteMerchantOperatorRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/merchants/operator-roles/${roleName}/permissions`,
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

  const updateMerchantOperatorRoleStatus: (roleName: string, roleStatus: boolean) => ApiResult<Role> = async (roleName, roleStatus) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/merchants/operator-roles/${roleName}/${roleStatus ?'disable': 'enable'}`,
        {
          method: "POST",
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
    getMerchantOperatorRoles,
    getMerchantOperatorRolePermissions,
    deleteMerchantOperatorRoleById,
    createNewMerchantOperatorRole,
    updateMerchantOperatorRoleStatus,
    updateMerchantOperatorRole,
    createMerchantOperatorRolePermissions,
    deleteMerchantOperatorRolePermissions,
    getMerchantOperatorRoleById
  };
};
