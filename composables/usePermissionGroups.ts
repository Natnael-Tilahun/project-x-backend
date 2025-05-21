import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { PermissionGroup } from "~/types";
import { useApi } from "./useApi";

export const usePermissionGroups = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken } = useAuth();
  const { fetch } = useApi();
  const { toast } = useToast();

  const getPermissionGroups: () => Promise<PermissionGroup[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<PermissionGroup[]>(
        '/api/v1/internal/permission-groups'
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
        throw new Error("No permission groups data received");
      }

      return data.value as unknown as PermissionGroup[];
    } catch (err) {
      throw err;
    }
  };

  const deletePermissionGroupById: (groupCode: string) => Promise<any> = async (groupCode) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/permission-groups/${groupCode}`,
        { method: "DELETE" }
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

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getPermissionGroupById: (groupCode: string) => Promise<PermissionGroup> = async (groupCode) => {
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
        throw new Error("No permission group data received");
      }

      return data.value as unknown as PermissionGroup;
    } catch (err) {
      throw err;
    }
  };

  const createNewPermissionGroup: (permissionGroupDetail: PermissionGroup) => Promise<PermissionGroup> = async (permissionGroupDetail) => {
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
        throw new Error("No permission group data received");
      }

      return data.value as unknown as PermissionGroup;
    } catch (err) {
      throw err;
    }
  };

  const updatePermissionGroup: (groupCode: string, permissionGroupDetail: any) => Promise<PermissionGroup> = async (groupCode, permissionGroupDetail) => {
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
        throw new Error("No permission group data received");
      }

      return data.value as unknown as PermissionGroup;
    } catch (err) {
      throw err;
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
