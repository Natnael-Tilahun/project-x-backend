import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination"; // Import usePagination

export const useRoles = () => {
  const { page, size, sort, data, total, loading, error, fetchData, onPageChange, onSizeChange, onSortChange } = usePagination<Role>('/api/v1/internal/roles/list'); // Integrate usePagination

  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false); // Remove or re-evaluate if still needed
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken, getAuthorities } = useAuth();
  const { toast } = useToast();
  const { fetch } = useApi();

  // getSystemRoles function is replaced by usePagination's fetchData

  const deleteSystemRoleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/roles/delete/${id}`,
        { method: "DELETE" }
      );

      // isLoading.value = pending.value; // Remove or re-evaluate
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after deletion
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

      // isLoading.value = pending.value; // Remove or re-evaluate

      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after creation
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
      fetchData(); // Refresh data after update
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
      fetchData(); // Refresh data after status update
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
      fetchData(); // Refresh data after permission creation
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteSystemRolePermissions: (roleName: string, permissionsData: any) => ApiResult<Role> = async (roleName, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(`/api/v1/internal/roles/${roleName}/permissions`,
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

  return {
    isLoading, // Remove or re-evaluate
    isUpdating,
    page,
    size,
    sort,
    systemRoles: data, // Alias data to systemRoles
    total,
    loading,
    error,
    fetchSystemRoles: fetchData, // Alias fetchData
    onPageChange,
    onSizeChange,
    onSortChange,
    getSystemRolePermissions,
    deleteSystemRoleById,
    createNewSystemRole,
    updateSystemRolePermissions,
    updateSystemRoleStatus,
    createSystemRolePermissions,
    deleteSystemRolePermissions
  };
};
