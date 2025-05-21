import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { UssdMenuList } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUssdMenus = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdMenus: (page?: number, size?: number) => ApiResult<UssdMenuList[]> = async (
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getUssdMenusWithChilds: (page?: number, size?: number) => ApiResult<UssdMenuList[]> = async (
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getUssdMenuById: (id: string) => ApiResult<UssdMenuList> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-lists/menu-names-by-id/${id}`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewUssdMenu: (ussdMenuData: any) => ApiResult<UssdMenuList> = async (ussdMenuData) => {
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateUssdMenuName: (ussdMenuData: any) => ApiResult<UssdMenuList> = async (
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateUssdMenuStatus: (id: string, status: string) => ApiResult<UssdMenuList> = async (
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteUssdMenu: (ussdMenuId: string) => ApiResult<UssdMenuList> = async (ussdMenuId) => {
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const storeUssdMenusToCache: () => ApiResult<UssdMenuList[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<UssdMenuList[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/menu-catch/store-all-to-catch`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const changeUssdMenusToCacheStatus: (status: any) => ApiResult<UssdMenuList[]> = async (status) => {
    try {
      const { data, pending, error, status: statusCode } = await useFetch<UssdMenuList[]>(
        `${runtimeConfig.public.USSD_API_BASE_URL}/api/v1/command`,
        {
          method: "POST",
          // headers: {
          //   Authorization: `Bearer ${store.accessToken}`,
          // },
          body: JSON.stringify(status),
        }
      );

      isLoading.value = pending.value;

      if (statusCode.value === "error") {
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      handleApiError(err);
      return null;
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
    storeUssdMenusToCache,
    changeUssdMenusToCacheStatus,
  };
};
