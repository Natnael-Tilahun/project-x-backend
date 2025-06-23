import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Menu } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import axios from "axios";

export const useMenus = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getMenus: (page?: number, size?: number) => ApiResult<Menu[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Menu[]>(
        '/api/v1/internal/menus',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getMenuById: (id: string) => ApiResult<Menu> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getChildrensByParentId: (id: string) => ApiResult<Menu> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${id}/children`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewMenu: (menuData: any) => ApiResult<Menu> = async (menuData) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        '/api/v1/internal/menus/create',
        {
          method: "POST",
          body: menuData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateMenu: (menuId: string, menuData: any) => ApiResult<Menu> = async (menuId, menuData) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${menuId}`,
        {
          method: "PATCH",
          body: menuData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateProductMenus: (menuId: string, menuData: any) => ApiResult<Menu> = async (menuId, menuData) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${menuId}/products`,
        {
          method: "PUT",
          body: menuData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateChildrenMenus: (menuId: string, menuData: any) => ApiResult<Menu> = async (menuId, menuData) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${menuId}/add-children`,
        {
          method: "POST",
          body: menuData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteMenu: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/menus/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const importMenus: (formData: FormData, options?: { onUploadProgress?: (progressEvent: any) => void }) => ApiResult<Menu> = async (formData, options) => {
    try {
      if (options && options.onUploadProgress) {
        const runtimeConfig = useRuntimeConfig();
        const { getHeaders } = useApi();
        // Use axios for upload progress
        try {
          const response = await axios.post<Menu>(
            `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/menus/import-bulk`,
            formData,
            {
              headers: {
                ...getHeaders(true),
                'Content-Type': 'multipart/form-data' 
              },
              onUploadProgress: options.onUploadProgress,
            }
          );
          return response.data as unknown as Menu;
        } catch (error: any) {
          throw error;
        }
      }
      // Default: use fetch
      const { data, pending, error, status } = await fetch<Menu>(
        '/api/v1/internal/menus/import-bulk',
        {
          method: "POST",
          body:  formData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Menu) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    getMenus,
    getMenuById,
    getChildrensByParentId,
    createNewMenu,
    deleteMenu,
    updateMenu,
    updateProductMenus,
    updateChildrenMenus,
    importMenus,
    isSubmitting,
  };
};
