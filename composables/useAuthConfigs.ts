import { useApi } from "./useApi";
import type { AuthConfiguration } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useAuthConfigs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getAuthConfigs: () => ApiResult<AuthConfiguration[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration[]>(
        '/api/v1/internal/auth-configs'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AuthConfiguration[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getAuthConfigById: (id: string) => ApiResult<AuthConfiguration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration>(
        `/api/v1/internal/auth-configs/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AuthConfiguration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewAuthConfig: (authConfigData: any) => ApiResult<AuthConfiguration> = async (authConfigData) => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration>(
        '/api/v1/internal/auth-configs',
        {
          method: "POST",
          body: authConfigData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AuthConfiguration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateAuthConfig: (authConfigId: string, authConfigData: any) => ApiResult<AuthConfiguration> = async (authConfigId, authConfigData) => {
    try {
      const { data, pending, error, status } = await fetch<AuthConfiguration>(
        `/api/v1/internal/auth-configs/${authConfigId}`,
        {
          method: "PATCH",
          body: authConfigData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AuthConfiguration) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteAuthConfig: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/auth-configs/${id}`,
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

  return {
    isLoading,
    getAuthConfigs,
    getAuthConfigById,
    createNewAuthConfig,
    deleteAuthConfig,
    updateAuthConfig,
    isSubmitting
  };
};
