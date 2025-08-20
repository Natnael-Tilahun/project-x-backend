import type { Permission } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

export const usePermissions = () => {
  // Server pagination state (mirrors staffRoles implementation)
  const {
    page,
    size,
    sort,
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
  } = usePagination<Permission>('/api/v1/internal/permissions');

  // Keep legacy loading flag for ad-hoc fetchers below
  const legacyIsLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();

  // Legacy list fetcher used by other forms (e.g. customer creation). Do not remove.
  const getPermissions: (page?: number, size?: number) => ApiResult<any> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        '/api/v1/internal/permissions',
        {
          params: {
            page: page,
            size: size,
          }
        }
      );

      legacyIsLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const getPermissionById: (code: string) => ApiResult<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}`
      );

      legacyIsLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission) : null;
    } catch (err) {
      throw err
    }
  };

  const enablePermission: (code: string) => ApiResult<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}/enable`,
        { method: "POST" }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission) : null;
    } catch (err) {
      throw err
    }
  };

  const disablePermission: (code: string) => ApiResult<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}/disable`,
        { method: "POST" }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    // Server pagination API
    page,
    size,
    sort,
    permissions: data,
    total,
    loading,
    error,
    fetchPermissions: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,

    // Legacy/auxiliary APIs
    isLoading: loading,
    isUpdating,
    getPermissions,
    getPermissionById,
    enablePermission,
    disablePermission,
  };
};
