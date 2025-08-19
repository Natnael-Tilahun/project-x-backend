import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

export const useStaffRoles = () => {
  // Removed isLoading ref
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken, getAuthorities } = useAuth();
  const { fetch } = useApi();
  const { page, size, sort, data, total, loading, error, fetchData, onPageChange, onSizeChange, onSortChange } = usePagination<Role>('/api/v1/internal/staff-roles/list');


  const deleteStaffRoleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff-roles/delete/${id}`,
        { method: "DELETE" }
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after deletion
      return data.value;
    } catch (err) {
      throw err
    }
  };

  const getStaffRolePermissions: (name: string) => ApiResult<Role> = async (name) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${name}/permissions`
      );

      // Removed isLoading.value = pending.value;
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

  const createNewStaffRole: (roleDetail: Role) => ApiResult<Role> = async (roleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        '/api/v1/internal/staff-roles/create',
        {
          method: "POST",
          body: roleDetail
        }
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after creation
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const updateStaffRole: (roleName: string, roleDetail: any) => ApiResult<Role> = async (roleName, roleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${roleName}/permissions/update`,
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
      fetchData(); // Refresh data after update
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const createStaffRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${roleName}/permissions`,
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

  const deleteStaffRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${roleName}/permissions`,
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

  const updateStaffRoleStatus: (roleName: string, roleStatus: boolean) => ApiResult<Role> = async (roleName, roleStatus) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${roleName}/${roleStatus ?'disable': 'enable'}`,
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
    // isLoading, // Removed
    isUpdating,
    page,
    size,
    sort,
    staffRoles: data, // Alias data to staffRoles
    total,
    loading,
    error,
    fetchStaffRoles: fetchData, // Alias fetchData
    onPageChange,
    onSizeChange,
    onSortChange,
    getStaffRolePermissions,
    deleteStaffRoleById,
    createNewStaffRole,
    updateStaffRoleStatus,
    updateStaffRole,
    createStaffRolePermissions,
    deleteStaffRolePermissions
  };
};