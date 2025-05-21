import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Permission } from "~/types";
import { useApi } from "./useApi";

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

  const getPermissions: (page?: number, size?: number) => Promise<any> = async (page, size) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No roles data received");
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getPermissionById: (code: string) => Promise<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No permission with this id received");
      }

      return data.value as unknown as Permission;
    } catch (err) {
      throw err;
    }
  };

  const enablePermission: (code: string) => Promise<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}/enable`,
        { method: "POST" }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No permission data received");
      }

      return data.value as unknown as Permission;
    } catch (err) {
      throw err;
    }
  };

  const disablePermission: (code: string) => Promise<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await fetch<Permission>(
        `/api/v1/internal/permissions/${code}/disable`,
        { method: "POST" }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No permission data received");
      }

      return data.value as unknown as Permission;
    } catch (err) {
      throw err;
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
