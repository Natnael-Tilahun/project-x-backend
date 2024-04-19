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
      const { data, pending, error, status } = await useFetch(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/sign-in/password`,
        {
          method: "POST",
          body: JSON.stringify(user),
          //   mode: "no-cors",
        }
      );

      store.setAuth({
        ...user,
        ...data.value,
        isAuthenticated: true,
        role: "Admin",
      });
      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
          action: h(
            ToastAction,
            {
              altText: "Try again",
            },
            {
              default: () => "Try again",
            }
          ),
        });

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
    } catch (err) {
      return console.log("error: ", err);
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
    try {
      // const data: any = await $fetch(
      //   `${runtimeConfig.public.API_BASE_URL}/api/v1/auth/sign-out`
      // );
      store.$reset();
      // setUser(data.user);

      return navigateTo("/login", { replace: true });
    } catch (err) {
      return console.log("error: ", err);
    }
  };
  return {
    login,
    userLoggedIn,
    userAdmin,
    logout,
    authUser,
    isLoading,
  };
};
