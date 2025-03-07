import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { PermissionGroup } from "~/types";

export const usePermissionGroups = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken } = useAuth();

  const store = useAuthStore();
  const { toast } = useToast();

  const getPermissionGroups: () => Promise<PermissionGroup[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<PermissionGroup[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permission-groups`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting permission groups error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No permission groups data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deletePermissionGroupById: (groupCode: string) => Promise<any> = async (groupCode) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permission-groups/${groupCode}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting permission group error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error("Deleting permission group error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getPermissionGroupById: (groupCode: string) => Promise<PermissionGroup> = async (groupCode) => {
    try {
      const { data, pending, error, status } = await useFetch<PermissionGroup>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permission-groups/${groupCode}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        if (error.value?.statusCode == 401) {
          await getRefreshToken().catch(e => {
            console.log("refreshing token error: ", e)
            navigateTo('/login')
          })
        }
        throw new Error("Getting permission group error: " + error);
      }
      if (!data.value) {
        throw new Error("No permission group data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewPermissionGroup: (permissionGroupDetail: PermissionGroup) => Promise<PermissionGroup> = async (permissionGroupDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<PermissionGroup>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permission-groups`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(permissionGroupDetail),
        }
      );
      isLoading.value = pending.value;
      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new permission group error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new permission group errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }
      if (!data.value) {
        throw new Error("No permission group data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updatePermissionGroup: (groupCode: string, permissionGroupDetail: any) => Promise<PermissionGroup> = async (groupCode, permissionGroupDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<PermissionGroup>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permission-groups/${groupCode}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(permissionGroupDetail),
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating permission group permissions error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data);
      }
      if (!data.value) {
        throw new Error("No permission group data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
