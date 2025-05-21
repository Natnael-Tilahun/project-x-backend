import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Profile } from "~/types";

export const useProfile = () => {
  const isLoading = ref<boolean>(false);
  const { toast } = useToast();
  const { fetch } = useApi();

  const getProfile: () => Promise<Profile> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Profile>(
        '/api/v1/users/me'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting profile error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No profile data received");
      }
      return data.value as unknown as Profile;
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
