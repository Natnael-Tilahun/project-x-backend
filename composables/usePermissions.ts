import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Permission } from "~/types";

export const usePermissions = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { toast } = useToast();
  const { pageNumber, pageSize } =
    usePagesInfoStore();
  const pageNumbers = ref<number>(pageNumber);
  const pageSizes = ref<number>(pageSize);
  const isUpdating = ref<boolean>(false);

  const getPermissions: (    page?: number,
    size?: number) => Promise<any> = async (page, size) => {
    try {
      // const { data, pending, error, status } = await useFetch<any>(
      //   `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permissions`,
      //   {
      //     query: {
      //       page: pageNumbers.value,
      //       size: pageSizes.value
      //     },
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${store.accessToken}`,
      //     },
      //     watch: [pageNumbers, pageSizes]
      //   },
      // );

      const { data, pending, error, status } = await useAsyncData(
        '',
        () => $fetch(`${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permissions`,
          {
            params: {
              page: page,
              size: size
            },
            method: "GET",
            headers: {
              Authorization: `Bearer ${store.accessToken}`,
            },
          }),
        {
          watch: [pageNumbers, pageSizes]

        }
      )


      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting Permission error: " + error.value);
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

  const getPermissionById: (code: string) => Promise<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await useFetch<Permission>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permissions/${code}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No permission with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const enablePermission: (code: string) => Promise<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await useFetch<Permission>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permissions/${code}/enable`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating permission error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data);
      }
      if (!data.value) {
        throw new Error("No permission data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const disablePermission: (code: string) => Promise<Permission> = async (code) => {
    try {
      const { data, pending, error, status } = await useFetch<Permission>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/permissions/${code}/disable`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating permission error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.message);
      }
      if (!data.value) {
        throw new Error("No permission data received");
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
    getPermissions,
    getPermissionById,
    enablePermission, 
    disablePermission
  };
};
