import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Application } from "~/types";

export const useApplications = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken } = useAuth();

  const store = useAuthStore();
  const { toast } = useToast();

  const getApplications: () => Promise<Application[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<Application[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting applications error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No applications data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getApplicationVersions: (
    applicationId: string
  ) => Promise<ApplicationVersion[]> = async (applicationId) => {
    try {
      const { data, pending, error, status } = await useFetch<
        ApplicationVersion[]
      >(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${applicationId}/app-versions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting applications versions error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No applications versions data received");
      }
      console.log("data.valueee: ", data.value);
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getApplicationById: (id: string) => Promise<Application> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<Application>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting application error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getApplicationVersionById: (
    applicationId: string,
    applicationVersionId: string
  ) => Promise<ApplicationVersion> = async (
    applicationId,
    applicationVersionId
  ) => {
    try {
      const { data, pending, error, status } =
        await useFetch<ApplicationVersion>(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${store.accessToken}`,
            },
          }
        );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting application version error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteApplicationById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting application error: ", error.value?.data?.message);
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error("Deleting application error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteApplicationVersionById: (
    applicationId: string,
    applicationVersionId: string
  ) => Promise<any> = async (applicationId, applicationVersionId) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log(
          "Deleting application version error: ",
          error.value?.data?.message
        );
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error("Deleting application version error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewApplication: (
    applicationDetail: Application
  ) => Promise<Application> = async (applicationDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<Application>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(applicationDetail),
        }
      );
      isLoading.value = pending.value;
      if (status.value === "error") {
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new application error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new application error: ",
            error.value?.data?.detail
          );
        }
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewApplicationVersion: (
    applicationId: string,
    applicationVersionDetail: ApplicationVersion
  ) => Promise<ApplicationVersion> = async (
    applicationId,
    applicationVersionDetail
  ) => {
    try {
      const { data, pending, error, status } =
        await useFetch<ApplicationVersion>(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${applicationId}/app-versions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${store.accessToken}`,
            },
            body: JSON.stringify(applicationVersionDetail),
          }
        );
      isLoading.value = pending.value;
      if (status.value === "error") {
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new application version error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new application version error: ",
            error.value?.data?.detail
          );
        }
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application versions data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateApplication: (
    applicationId: string,
    applicationDetail: any
  ) => Promise<Application> = async (applicationId, applicationDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<Application>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(applicationDetail),
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating application error: ", error.value?.data?.detail);
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateApplicationVersion: (
    applicationId: string,
    applicationVersionId: string,
    applicationVersionDetail: any
  ) => Promise<ApplicationVersion> = async (
    applicationId,
    applicationVersionId,
    applicationVersionDetail
  ) => {
    try {
      const { data, pending, error, status } =
        await useFetch<ApplicationVersion>(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/applications/${applicationId}/app-versions/${applicationVersionId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${store.accessToken}`,
            },
            body: JSON.stringify(applicationVersionDetail),
          }
        );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log(
          "Updating application version error: ",
          error.value?.data?.message
        );
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No application versions data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
