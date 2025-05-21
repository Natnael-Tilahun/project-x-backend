import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Application, AppVersion } from "~/types";

export const useApplications = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getApplications: () => Promise<Application[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Application[]>(
        '/api/v1/internal/applications'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting applications error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No applications data received");
      }
      return data.value as unknown as Application[];
    } catch (err) {
      throw err;
    }
  };

  const getApplicationVersions: (applicationId: string) => Promise<AppVersion[]> = async (applicationId) => {
    try {
      const { data, pending, error, status } = await fetch<AppVersion[]>(
        `/api/v1/internal/applications/${applicationId}/app-versions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting applications versions error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No applications versions data received");
      }
      return data.value as unknown as AppVersion[];
    } catch (err) {
      throw err;
    }
  };

  const getApplicationById: (id: string) => Promise<Application> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Application>(
        `/api/v1/internal/applications/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting application error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value as unknown as Application;
    } catch (err) {
      throw err;
    }
  };

  const getApplicationVersionById: (applicationId: string, applicationVersionId: string) => Promise<AppVersion> = async (applicationId, applicationVersionId) => {
    try {
      const { data, pending, error, status } = await fetch<AppVersion>(
        `/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting application version error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value as unknown as AppVersion;
    } catch (err) {
      throw err;
    }
  };

  const deleteApplicationById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/applications/${id}`,
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
        throw new Error("Deleting application error: " + error.value);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const deleteApplicationVersionById: (applicationId: string, applicationVersionId: string) => Promise<any> = async (applicationId, applicationVersionId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`,
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
        throw new Error("Deleting application version error: " + error.value);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const createNewApplication: (applicationDetail: Application) => Promise<Application> = async (applicationDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value as unknown as Application;
    } catch (err) {
      throw err;
    }
  };

  const createNewApplicationVersion: (applicationId: string, applicationVersionDetail: AppVersion) => Promise<AppVersion> = async (applicationId, applicationVersionDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application versions data received");
      }
      return data.value as unknown as AppVersion;
    } catch (err) {
      throw err;
    }
  };

  const updateApplication: (applicationId: string, applicationDetail: any) => Promise<Application> = async (applicationId, applicationDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value as unknown as Application;
    } catch (err) {
      throw err;
    }
  };

  const updateApplicationVersion: (applicationId: string, applicationVersionId: string, applicationVersionDetail: any) => Promise<AppVersion> = async (applicationId, applicationVersionId, applicationVersionDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application versions data received");
      }
      return data.value as unknown as AppVersion;
    } catch (err) {
      throw err;
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
