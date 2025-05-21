import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Permission } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const usePermissions = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const { toast } = useToast();
  const { pageNumber, pageSize } = usePagesInfoStore();
  const pageNumbers = ref<number>(pageNumber);
  const pageSizes = ref<number>(pageSize);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();

  const getPermissions: (page?: number, size?: number) => ApiResult<any> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        '/api/v1/internal/permissions',
        {
          params: {
            page: page || pageNumbers.value,
            size: size || pageSizes.value
          }
        }
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

  const getPermissionById: (code: string) => ApiResult<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission) : null;
    } catch (err) {
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    isUpdating,
    getPermissions,
    getPermissionById,
    enablePermission, 
    disablePermission
  };
};
