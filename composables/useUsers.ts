import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useUsers = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { toast } = useToast();

  const getUsers: () => Promise<any[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/internal/users/list`,
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

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  return {
    isLoading,
    getUsers,
  };
};
