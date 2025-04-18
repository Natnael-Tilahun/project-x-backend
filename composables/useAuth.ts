import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useAuth = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { toast } = useToast();

  const setUser = (user: User) => {
    authUser.value = user;
  };

  const login = async (user: UserInput) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/sign-in/password`,
        {
          method: "POST",
          body: JSON.stringify(user),
        }
      );

      if (status.value === "error") {
        // Handle the error, e.g., display a toast message or stay on the login page
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
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getRefreshToken = async () => {
    try {
      const { data, pending, error, status } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          body: {
            refreshToken: store.refreshToken,
          },
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      if (status.value === "error") {
        // Handle the error, e.g., display a toast message or stay on the login page
        toast({
          title: error?.value?.data?.title,
          description: error?.value?.data?.detail,
          variant: "destructive",
        });
        console.log("Refresh-token error: ", error);

        throw new Error("Refresh-token error: " + error.value);
      }
      console.log("v1/api/auth/refresh-token: ", data);

      // store.setAuth({
      //   ...user,
      //   ...data?.value,
      //   isAuthenticated: true,
      //   role: "Admin",
      // });
      // isLoading.value = pending.value;
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getAuthorities = async () => {
    console.log("getAuthorities")
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/roles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      if (status.value === "error") {
        // Handle the error, e.g., display a toast message or stay on the login page
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

        // navigateTo('/')

      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const userLoggedIn = async () => {
    if (!authUser.value) {
      const { data, error, status, pending } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/status`,
        {
          headers: useRequestHeaders(["cookie"]),
        }
      );

      if (status.value === "error") {
        return error.value;
      }

      //   if (data.isAdmin) {
      //     userAdmin.value = true;
      //   } else {
      //     userAdmin.value = false;
      //   }
      //   setUser(data.user);

      //   if (data.value) {
      //     const token = useCookie('token'); // useCookie new hook in nuxt 3
      //     token.value = data?.value?.token; // set token to cookie
      //     this.authenticated = true; // set authenticated  state value to true
      //   }
      else {
        return data.value;
      }
      //   setUser(data.user);
    }
  };

  const logout = async () => {


    // try {
    //   const { data, pending, error, status } = await useFetch(
    //     `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/sign-out`,
    //     {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${store.accessToken}`,
    //       },
    //     }
    //   );
    //   isLoading.value = pending.value;
    //   if (status.value === "error") {
    //     throw new Error("Logout error: " + error.value);
    //   }
    store.$reset();
    return navigateTo("/login", { replace: true });
    // return data.value;
    // } catch (err) {
    //   // Throw the error to be caught and handled by the caller
    //   throw err;
    // }
  };

  const getProfile = async () => {
    try {
      const { data, pending, error, status } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/users/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      // store.setAuth({
      //   ...user,
      //   ...data.value,
      //   isAuthenticated: true,
      //   role: "Admin",
      // });
      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Profile error: " + error.value);
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const setNewPassword = async (newData: any) => {
    try {
      const { data, pending, error, status } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/users/reset-password/finish`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: newData,
        }
      );
      
      if (status.value === "error") {
        throw new Error("New password error: " + error.value);
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
