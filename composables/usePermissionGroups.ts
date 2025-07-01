import { useAuthUser } from "./useAuthUser";
import type { PermissionGroup } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const usePermissionGroups = () => {
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken } = useAuth();
  const { fetch } = useApi();

  const getPermissionGroups: () => ApiResult<PermissionGroup[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<PermissionGroup[]>(
        '/api/v1/internal/permission-groups'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PermissionGroup[]) : null;
    } catch (err) {
      throw err
    }
  };

  const deletePermissionGroupById: (groupCode: string) => ApiResult<any> = async (groupCode) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/permission-groups/${groupCode}`,
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

  const getPermissionGroupById: (groupCode: string) => ApiResult<PermissionGroup> = async (groupCode) => {
    try {
      const { data, pending, error, status } = await fetch<PermissionGroup>(
        `/api/v1/internal/permission-groups/${groupCode}`
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

      return data.value ? (data.value as unknown as PermissionGroup) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewPermissionGroup: (permissionGroupDetail: PermissionGroup) => ApiResult<PermissionGroup> = async (permissionGroupDetail) => {
    try {
      const { data, pending, error, status } = await fetch<PermissionGroup>(
        '/api/v1/internal/permission-groups',
        {
          method: "POST",
          body: permissionGroupDetail
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PermissionGroup) : null;
    } catch (err) {
      throw err
    }
  };

  const updatePermissionGroup: (groupCode: string, permissionGroupDetail: any) => ApiResult<PermissionGroup> = async (groupCode, permissionGroupDetail) => {
    try {
      const { data, pending, error, status } = await fetch<PermissionGroup>(
        `/api/v1/internal/permission-groups/${groupCode}`,
        {
          method: "PATCH",
          body: permissionGroupDetail
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PermissionGroup) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    isUpdating,
    getPermissionGroups,
    getPermissionGroupById,
    deletePermissionGroupById,
    createNewPermissionGroup,
    updatePermissionGroup,
  };
};
