import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination"; // Import usePagination

export const useMerchantRoles = () => {
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken, getAuthorities } = useAuth();
  const { fetch } = useApi();
  const { page, size, sort, data, total, loading, error, fetchData, onPageChange, onSizeChange, onSortChange } = usePagination<Role>('/api/v1/internal/merchants/operator-roles');

  const deleteMerchantOperatorRoleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchants/operator-roles/${id}`,
        { method: "DELETE" }
      );

      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after deletion
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

      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after creation
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
      fetchData(); // Refresh data after update
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
      fetchData(); // Refresh data after permission creation
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
      fetchData(); // Refresh data after permission deletion
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
      fetchData(); // Refresh data after status update
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isUpdating,
    page,
    size,
    sort,
    merchantOperatorRoles: data, // Alias data to merchantOperatorRoles
    total,
    loading,
    error,
    fetchMerchantOperatorRoles: fetchData, // Alias fetchData
    onPageChange,
    onSizeChange,
    onSortChange,
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
