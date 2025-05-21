import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { User, UserInput } from "~/types";
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
        '/api/v1/auth/sign-in/password',
        {
          method: "POST",
          body: user,
          includeAuth: false
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
          isAuthenticated: true
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
        '/api/v1/auth/refresh-token',
        {
          method: "POST",
          body: {
            refreshToken: store.refreshToken,
          }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getAuthorities: () => ApiResult<AuthResponse> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        '/api/v1/auth/roles'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      const response = data.value as AuthResponse;
      if (status.value === "success" && response?.permissions) {
        store.$patch({
          permissions: response.permissions
        });
      }

      return response;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const userLoggedIn: () => ApiResult<AuthResponse> = async () => {
    if (!authUser.value) {
      try {
        const { data, error, status } = await fetch<AuthResponse>(
          '/api/v1/auth/status'
        );

        if (status.value === "error") {
          handleApiError(error);
        }

        return data.value as AuthResponse;
      } catch (err) {
        handleApiError(err);
        return null;
      }
    }
    return null;
  };

  const logout = async () => {
    store.$reset();
    return navigateTo("/login", { replace: true });
  };

  const getProfile: () => ApiResult<AuthResponse> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        '/api/v1/users/me'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const setNewPassword: (newData: any) => ApiResult<AuthResponse> = async (newData) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        '/api/v1/users/reset-password/finish',
        {
          method: "POST",
          body: newData,
          includeAuth: false
        }
      );
      
      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value as AuthResponse;
    } catch (err) {
      handleApiError(err);
      return null;
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
  };
};
