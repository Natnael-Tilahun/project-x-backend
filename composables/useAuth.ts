import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type {
  OtpDTO,
  TFAAccessTokenDTO,
  User,
  UserInput,
  VerificationRequest,
} from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  permissions?: string[];
}

export const useAuth = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { toast } = useToast();
  const { fetch } = useApi();

  const setUser = (user: User) => {
    authUser.value = user;
  };

  const login: (user: UserInput) => ApiResult<AuthResponse> = async (user) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/auth/sign-in/password",
        {
          method: "POST",
          body: user,
          includeAuth: false,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      const response = data.value as AuthResponse;
      if (response?.accessToken) {
        store.$patch({
          ...user,
          ...response,
          isAuthenticated: true,
        });
        await getAuthorities();
      }

      return response;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getRefreshToken: () => ApiResult<AuthResponse> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/auth/refresh-token",
        {
          method: "POST",
          body: {
            refreshToken: store.refreshToken,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      throw err;
    }
  };

  const getAuthorities: () => ApiResult<AuthResponse> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/auth/roles"
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        navigateTo("/login");
        await handleApiError(error);
      }

      const response = data.value as AuthResponse;
      if (status.value === "success" && response?.permissions) {
        store.$patch({
          permissions: response.permissions,
        });
      }

      return response;
    } catch (err) {
      handleApiError(err);
      navigateTo("/login");
      return null;
    }
  };

  const userLoggedIn: () => ApiResult<AuthResponse> = async () => {
    if (!authUser.value) {
      try {
        const { data, error, status } = await fetch<AuthResponse>(
          "/api/v1/internal/auth/status"
        );

        if (status.value === "error") {
          handleApiError(error);
        }

        return data.value as AuthResponse;
      } catch (err) {
        throw err;
      }
    }
    return null;
  };

  const logout = async () => {
    // Get the session management functions from the plugin
    const { $releaseSession, $notifyLogout } = useNuxtApp();

    // Release the session
    $releaseSession();

    // Notify other tabs about the logout
    $notifyLogout();

    store.$reset();
    return navigateTo("/login", { replace: true });
  };

  const getProfile: () => ApiResult<AuthResponse> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/users/self/me"
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      throw err;
    }
  };

  const setNewPassword: (newData: any) => ApiResult<AuthResponse> = async (
    newData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/users/self/reset-password/finish",
        {
          method: "POST",
          body: newData,
          includeAuth: false,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      throw err;
    }
  };

  const initPasswordReset: (newData: any) => ApiResult<AuthResponse> = async (
    newData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/users/self/reset-password/init",
        {
          method: "POST",
          body: newData,
          includeAuth: false,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      throw err;
    }
  };

  const requestTwoFactorAuth: (
    deliveryMethod?: string
  ) => ApiResult<OtpDTO> = async (deliveryMethod) => {
    try {
      const { data, pending, error, status } = await fetch<OtpDTO>(
        `/api/v1/internal/auth/two-factor/request-token?deliveryMethod=${deliveryMethod}`,
        {
          method: "POST",
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      const response = data.value as OtpDTO;
      if (status.value === "success" && response?.verificationId) {
        store.$patch({
          verificationId: response.verificationId,
        });
      }

      return response;
    } catch (err) {
      throw err;
    }
  };

  const validateTwoFactorAuth: (
    otp: string
  ) => ApiResult<TFAAccessTokenDTO> = async (otp) => {
    try {
      const { data, pending, error, status } = await fetch<TFAAccessTokenDTO>(
        `/api/v1/internal/auth/two-factor/validate`,
        {
          method: "POST",
          body: {
            verificationId: store.verificationId,
            otp: otp,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      const response = data.value as TFAAccessTokenDTO;
      if (status.value === "success" && response?.token) {
        store.$patch({
          twoFactorToken: response.token,
        });
      }

      return response;
    } catch (err) {
      throw err;
    }
  };

  const changePassword: (newData: any) => ApiResult<any> = async (newData) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/internal/users/self/change-password",
        {
          method: "POST",
          body: newData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return { data: data.value as any, status };
    } catch (err) {
      throw err;
    }
  };

  return {
    login,
    userLoggedIn,
    userAdmin,
    Error,
    logout,
    authUser,
    isLoading,
    getProfile,
    getRefreshToken,
    setNewPassword,
    getAuthorities,
    requestTwoFactorAuth,
    validateTwoFactorAuth,
    changePassword,
    initPasswordReset,
  };
};
