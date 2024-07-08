import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useProfile = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { toast } = useToast();

  const getProfile: () => Promise<Profile> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<Profile>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/users/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting profile error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No profile data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  return {
    isLoading,
    getProfile,
  };
};
