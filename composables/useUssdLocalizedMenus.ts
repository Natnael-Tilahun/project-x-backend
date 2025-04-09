import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { LocalizedDefaultMessage, LocalizedUssdMenu } from "~/types";

export const useUssdLocalizedMenus = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdLocalizedMenus: (page?: number, size?: number) => Promise<LocalizedUssdMenu[]> = async (
    page,
    size
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedUssdMenu[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-menu`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No localized menus data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUssdLocalizedMenuById: (id: string) => Promise<LocalizedUssdMenu> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedUssdMenu>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-menu/${id}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No localized menu with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUssdLocalizedMenu: (defaultMessageData: any) => Promise<LocalizedUssdMenu> = async (defaultMessageData) => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedUssdMenu>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-menu`,
        {
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          body: JSON.stringify(defaultMessageData),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log("Creating new localized menu error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new localized menu error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new localized menu errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No localized menu received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdLocalizedMenu: (menuId: string, menuData: any) => Promise<LocalizedUssdMenu> = async (
    menuId,
    menuData
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedUssdMenu>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-menu/update-menu/${menuId}`,
        {
          method: "PUT",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          body: JSON.stringify(menuData),
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Updating localized menu error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log("Updating localized menu errorrr: ", error.value?.data?.message);
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No localized menu with this menu id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUssdLocalizedMenu: (
    menuId: string,
    ) => Promise<LocalizedUssdMenu | null> = async (menuId) => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedUssdMenu>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/localized-menu/${menuId}`,
        {
          method: "DELETE",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Deleting localized menu error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Deleting localized menu errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };


  return {
    isLoading,
    getUssdLocalizedMenus,
    getUssdLocalizedMenuById,
    createNewUssdLocalizedMenu,
    updateUssdLocalizedMenu,
    deleteUssdLocalizedMenu,
    isSubmitting,
  };
};
