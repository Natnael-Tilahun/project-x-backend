import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

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

  const getPermissions: () => Promise<any> = async () => {
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
              page: pageNumbers.value,
              size: pageSizes.value
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

  return {
    isLoading,
    getPermissions,
  };
};
