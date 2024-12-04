import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useOperationResponseOutputs = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getResponseOutputs: () => Promise<ResponseOutput[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<ResponseOutput[]>(
        `${runtimeConfig.public.API_BASE_URL}/internal/response-outputs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No response outputs data received");
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getResponseOutputById: (id: string) => Promise<ResponseOutput> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ResponseOutput>(
        `${runtimeConfig.public.API_BASE_URL}/internal/response-outputs/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No response output with this id received");
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const createNewResponseOutput: (responseOutputData: any) => Promise<ResponseOutput> = async (responseOutputData) => {
    console.log("createNewResponseOutput responseOutputData: ", responseOutputData);
    try {
      const { data, pending, error, status } = await useFetch<ResponseOutput>(
          `${runtimeConfig.public.API_BASE_URL}/internal/response-outputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(responseOutputData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

        console.log("Creating new response output error: ", error.value?.data.detail)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new response output error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new response output errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No response output received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateResponseOutput: (responseOutputId: string, responseOutputData: any) => Promise<ResponseOutput> = async (responseOutputId, responseOutputData) => {
    try {
      const { data, pending, error, status } = await useFetch<ResponseOutput>(
        `${runtimeConfig.public.API_BASE_URL}/internal/response-outputs/${responseOutputId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(responseOutputData),
        },
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Updating response output error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating response output errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No response output with this response output id received");
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const deleteResponseOutput: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/internal/response-outputs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting response output error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };


  return {
    isLoading,
    getResponseOutputs,
    getResponseOutputById,
    createNewResponseOutput,
    deleteResponseOutput,
    updateResponseOutput,
    isSubmitting
  };
};
