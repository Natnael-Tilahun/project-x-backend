import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Menu } from "~/types";

export const useMenus = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getMenus: (page?: number, size?: number) => Promise<Menu[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Menu[]>(
        '/api/v1/internal/menus',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No menus data received");
      }

      return data.value as unknown as Menu[];
    } catch (err) {
      throw err;
    }
  };

  const getMenuById: (id: string) => Promise<Menu> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No menu with this id received");
      }

      return data.value as unknown as Menu;
    } catch (err) {
      throw err;
    }
  };

  const createNewMenu: (menuData: any) => Promise<Menu> = async (menuData) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        '/api/v1/internal/menus',
        {
          method: "POST",
          body: menuData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No menu received");
      }

      return data.value as unknown as Menu;
    } catch (err) {
      throw err;
    }
  };

  const updateMenu: (menuId: string, menuData: any) => Promise<Menu> = async (menuId, menuData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No menu with this menu id received");
      }

      return data.value as unknown as Menu;
    } catch (err) {
      throw err;
    }
  };

  const updateProductMenus: (menuId: string, menuData: any) => Promise<Menu> = async (menuId, menuData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No menu products with this menu id received");
      }

      return data.value as unknown as Menu;
    } catch (err) {
      throw err;
    }
  };

  const updateChildrenMenus: (menuId: string, menuData: any) => Promise<Menu> = async (menuId, menuData) => {
    try {
      const { data, pending, error, status } = await fetch<Menu>(
        `/api/v1/internal/menus/${menuId}/children`,
        {
          method: "PUT",
          body: menuData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No menu children with this menu id received");
      }

      return data.value as unknown as Menu;
    } catch (err) {
      throw err;
    }
  };

  const deleteMenu: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/menus/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  return {
    isLoading,
    getMenus,
    getMenuById,
    createNewMenu,
    deleteMenu,
    updateMenu,
    updateProductMenus,
    updateChildrenMenus,
    isSubmitting,
  };
};
