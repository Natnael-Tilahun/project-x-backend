import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type {
  LocalizedDefaultMessage,
  LocalizedUssdMenu,
  UssdMenuList,
} from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUssdLocalizedMenus = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUssdLocalizedMenus: (
    page?: number,
    size?: number
  ) => ApiResult<LocalizedUssdMenu[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<
        LocalizedUssdMenu[]
      >(
        `${__USSD_API_BASE_URL__}/api/v1/localized-menu/by-language`,
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
      throw err
    }
  };

  const getUssdLocalizedMenuById: (
    id: string
  ) => ApiResult<LocalizedUssdMenu> = async (id) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedUssdMenu>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-menu/${id}`,
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
      throw err
    }
  };

  const createNewUssdLocalizedMenu: (
    defaultMessageData: any
  ) => ApiResult<LocalizedUssdMenu> = async (defaultMessageData) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedUssdMenu>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-menu`,
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  const updateUssdLocalizedMenu: (
    menuId: string,
    menuData: any
  ) => ApiResult<LocalizedUssdMenu> = async (
    menuId,
    menuData
  ) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedUssdMenu>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-menu/edit-localized-menu-byId/${menuId}`,
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
        handleApiError(error);
      }

      return data.value ? data.value : null;
    } catch (err) {
      throw err
    }
  };

  const updateUssdLocalizedMenuStatus: (
    id: string,
    status: string
  ) => ApiResult<LocalizedUssdMenu> = async (id, status) => {
    try {
      const {
        data,
        pending,
        error,
        status: statusCode,
      } = await useFetch<LocalizedUssdMenu>(
        `${__USSD_API_BASE_URL__}/api/v1/localized-menu/update-enable-disable?menuId=${id}&status=${status}`,
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
      throw err
    }
  };

  const deleteUssdLocalizedMenu: (
    menuId: string
  ) => ApiResult<LocalizedUssdMenu> = async (menuId) => {
    try {
      const { data, pending, error, status } =
        await useFetch<LocalizedUssdMenu>(
          `${__USSD_API_BASE_URL__}/api/v1/localized-menu/${menuId}`,
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
      throw err
    }
  };


  const cacheLocalizedMenusToRedis: () => ApiResult<LocalizedUssdMenu[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<LocalizedUssdMenu[]>(
        `${__USSD_API_BASE_URL__}/api/v1/redis/cache-toRedis-localize-menu`,
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
      throw err
    }
  };

  return {
    isLoading,
    getUssdLocalizedMenus,
    getUssdLocalizedMenuById,
    createNewUssdLocalizedMenu,
    updateUssdLocalizedMenu,
    updateUssdLocalizedMenuStatus,
    deleteUssdLocalizedMenu,
    isSubmitting,
    cacheLocalizedMenusToRedis,
  };
};
