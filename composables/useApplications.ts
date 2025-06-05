import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Application, AppVersion } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useApplications = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getApplications: () => ApiResult<Application[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Application[]>(
        '/api/v1/internal/applications'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Application[]) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const getApplicationVersions: (applicationId: string) => ApiResult<AppVersion[]> = async (applicationId) => {
    try {
      const { data, pending, error, status } = await fetch<AppVersion[]>(
        `/api/v1/internal/applications/${applicationId}/app-versions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AppVersion[]) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const getApplicationById: (id: string) => ApiResult<Application> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Application>(
        `/api/v1/internal/applications/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Application) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const getApplicationVersionById: (applicationId: string, applicationVersionId: string) => ApiResult<AppVersion> = async (applicationId, applicationVersionId) => {
    try {
      const { data, pending, error, status } = await fetch<AppVersion>(
        `/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AppVersion) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const deleteApplicationById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/applications/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const deleteApplicationVersionById: (applicationId: string, applicationVersionId: string) => ApiResult<any> = async (applicationId, applicationVersionId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const createNewApplication: (applicationDetail: Application) => ApiResult<Application> = async (applicationDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Application>(
        '/api/v1/internal/applications',
        {
          method: "POST",
          body: applicationDetail
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Application) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const createNewApplicationVersion: (applicationId: string, applicationVersionDetail: AppVersion) => ApiResult<AppVersion> = async (applicationId, applicationVersionDetail) => {
    try {
      const { data, pending, error, status } = await fetch<AppVersion>(
        `/api/v1/internal/applications/${applicationId}/app-versions`,
        {
          method: "POST",
          body: applicationVersionDetail
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AppVersion) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const updateApplication: (applicationId: string, applicationDetail: any) => ApiResult<Application> = async (applicationId, applicationDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Application>(
        `/api/v1/internal/applications/${applicationId}`,
        {
          method: "PATCH",
          body: applicationDetail
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Application) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  const updateApplicationVersion: (applicationId: string, applicationVersionId: string, applicationVersionDetail: any) => ApiResult<AppVersion> = async (applicationId, applicationVersionId, applicationVersionDetail) => {
    try {
      const { data, pending, error, status } = await fetch<AppVersion>(
        `/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`,
        {
          method: "PATCH",
          body: applicationVersionDetail
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as AppVersion) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }
  };

  return {
    isLoading,
    isUpdating,
    getApplications,
    getApplicationVersions,
    getApplicationById,
    getApplicationVersionById,
    deleteApplicationById,
    deleteApplicationVersionById,
    createNewApplication,
    createNewApplicationVersion,
    updateApplicationVersion,
    updateApplication,
  };
};
