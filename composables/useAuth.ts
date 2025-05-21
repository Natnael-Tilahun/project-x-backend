import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { User, UserInput } from "~/types";

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

  const login = async (user: UserInput) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        '/api/v1/auth/sign-in/password',
        {
          method: "POST",
          body: JSON.stringify(user),
          includeAuth: false
        }
      );

      if (status.value === "error") {
        toast({
          title: error?.value?.data?.title,
          description: error?.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error("Login error: " + error.value);
      }

      console.log("faffd: ", data.value)
      store.setAuth({
        ...user,
        ...data?.value,
        isAuthenticated: data?.value.accessToken ? true : false,
      });
      await getAuthorities()
      isLoading.value = pending.value;
      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getRefreshToken = async () => {
    try {
      const { data, pending, error, status } = await fetch(
        '/api/v1/auth/refresh-token',
        {
          method: "POST",
          body: {
            refreshToken: store.refreshToken,
          }
        }
      );

      if (status.value === "error") {
        toast({
          title: error?.value?.data?.title,
          description: error?.value?.data?.detail,
          variant: "destructive",
        });
        console.log("Refresh-token error: ", error);
        throw new Error("Refresh-token error: " + error.value);
      }
      console.log("v1/api/auth/refresh-token: ", data);
      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getAuthorities = async () => {
    console.log("getAuthorities")
    try {
      const { data, pending, error, status } = await fetch<any>(
        '/api/v1/auth/roles'
      );

      if (status.value === "error") {
        toast({
          title: error?.value?.data?.title || error?.value,
          description: error?.value?.data?.detail,
          variant: "destructive",
        });
        console.log("Getting roles error: ", error);
        throw new Error("Getting role error: " + error.value);
      }
      if (status.value === "success") {
        store.setPermissions({
          permissions: data?.value && data?.value?.permissions
        });
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const userLoggedIn = async () => {
    if (!authUser.value) {
      const { data, error, status, pending } = await fetch(
        '/api/v1/auth/status',
        {
          headers: useRequestHeaders(["cookie"])
        }
      );

      if (status.value === "error") {
        return error.value;
      } else {
        return data.value;
      }
    }
  };

  const logout = async () => {
    store.$reset();
    return navigateTo("/login", { replace: true });
  };

  const getProfile = async () => {
    try {
      const { data, pending, error, status } = await fetch(
        '/api/v1/users/me'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Profile error: " + error.value);
      }
      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const setNewPassword = async (newData: any) => {
    try {
      const { data, pending, error, status } = await fetch(
        '/api/v1/users/reset-password/finish',
        {
          method: "POST",
          body: newData,
          includeAuth: false
        }
      );
      
      if (status.value === "error") {
        throw new Error("New password error: " + error.value);
      }
      return data.value;
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
  };
};
