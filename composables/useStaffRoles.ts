import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useStaffRoles = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken, getAuthorities } = useAuth();
  const { toast } = useToast();
  const { fetch } = useApi();

  const getStaffRoles: () => ApiResult<Role[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Role[]>(
        '/api/v1/internal/staff-roles/list'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Role[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteStaffRoleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff-roles/delete/${id}`,
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

  const getStaffRolePermissions: (name: string) => ApiResult<Role> = async (name) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${name}/permissions`
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
      handleApiError(err);
      return null;
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

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateStaffRolePermissions: (roleName: string, roleDetail: any) => ApiResult<Role> = async (roleName, roleDetail) => {
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
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateStaffRoleStatus: (roleName: string, roleStatus: boolean) => ApiResult<Role> = async (roleName, roleStatus) => {
    try {
      const { data, pending, error, status } = await fetch<Role>(
        `/api/v1/internal/staff-roles/${roleName}`,
        {
          method: "POST",
          params: {
            action: roleStatus ? "disable" : "enable"
          }
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      await getAuthorities();
      return data.value ? (data.value as unknown as Role) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    isUpdating,
    getStaffRoles,
    getStaffRolePermissions,
    deleteStaffRoleById,
    createNewStaffRole,
    updateStaffRolePermissions,
    updateStaffRoleStatus,
  };
};
