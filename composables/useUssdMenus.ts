import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { UssdMenuList } from "~/types";

export const useUssdMenus = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdMenus: (page?: number, size?: number) => Promise<UssdMenuList[]> = async (
    page,
    size
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/menu-names`,
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
        throw new Error("No ussd menus data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUssdMenusWithChilds: (page?: number, size?: number) => Promise<UssdMenuList[]> = async (
    page,
    size
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/menu-names-with-child`,
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
        throw new Error("No ussd menus data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };


  const getUssdMenuById: (id: string) => Promise<UssdMenuList> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/menu-names/${id}`,
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
        throw new Error("No ussd menu with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUssdMenu: (ussdMenuData: any) => Promise<UssdMenuList> = async (ussdMenuData) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/menu-names`,
        {
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          body: JSON.stringify(ussdMenuData),
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

        console.log("Creating new ussd menu error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new ussd menu error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new ussd menu errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No ussd menu received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdMenuName: (ussdMenuData: any) => Promise<UssdMenuList> = async (
    ussdMenuData
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/update-menu`,
        {
          method: "PUT",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          body: JSON.stringify(ussdMenuData),
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
            "Updating ussd menu error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log("Updating ussd menu errorrr: ", error.value?.data?.message);
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No ussd menu with this ussd menu id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUssdMenuStatus: (id: string, status: string) => Promise<UssdMenuList> = async (
    id,
    status
  ) => {
    try {
      const { data, pending, error, status: statusCode } = await useFetch<UssdMenuList>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/${id}/${status}`,
        {
          method: "PUT",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isSubmitting.value = pending.value;

      if (statusCode.value === "error") {
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
            "Updating ussd menu status error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log("Updating ussd menu status errorrr: ", error.value?.data?.message);
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No ussd menu status received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUssdMenu: (
    ussdMenuId: string,
  ) => Promise<UssdMenuList | null> = async (ussdMenuId) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/menu-names/${ussdMenuId}`,
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
            "Deleting ussd menu error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Deleting ussd menu errorrr: ",
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
    getUssdMenus,
    getUssdMenusWithChilds,
    getUssdMenuById,
    createNewUssdMenu,
    updateUssdMenuName,
    updateUssdMenuStatus,
    deleteUssdMenu,
    isSubmitting,
  };
};
