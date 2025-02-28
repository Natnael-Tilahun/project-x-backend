import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Role } from "~/types";
export const useRoles = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken } = useAuth();

  const store = useAuthStore();
  const { toast } = useToast();

  const getRoles: () => Promise<Role[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<Role[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/roles/list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting user error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No roles data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteRoleById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/roles/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting role error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error("Deleting role error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getRolePermissions: (name: string) => Promise<Role> = async (name) => {
    console.log("name: ", name)
    try {
      const { data, pending, error, status } = await useFetch<Role>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/roles/${name}/permissions`,
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
        throw new Error("Getting user error: " + error);
      }
      if (!data.value) {
        throw new Error("No roles data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewRole: (roleDetail: Role) => Promise<Role> = async (roleDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<Role>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/roles/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(roleDetail),
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
          console.log("Creating new customer error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new customer errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }
      if (!data.value) {
        throw new Error("No roles data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateRolePermissions: (roleName: string, roleDetail: any) => Promise<Role> = async (roleName, roleDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<Role>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/roles/${roleName}/permissions/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(roleDetail),
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating role permissions error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data);
      }
      if (!data.value) {
        throw new Error("No roles data received");
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
    getRoles,
    getRolePermissions,
    deleteRoleById,
    createNewRole,
    updateRolePermissions,
  };
};
