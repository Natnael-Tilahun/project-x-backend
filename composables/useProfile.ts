import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Profile } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useProfile = () => {
  const isLoading = ref<boolean>(false);
  const { toast } = useToast();
  const { fetch } = useApi();

  const getProfile: () => ApiResult<Profile> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Profile>(
        '/api/v1/users/me'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Profile) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    getProfile,
  };
};
