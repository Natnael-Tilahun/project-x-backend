import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useOperationRequestInputs = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getRequestInputs: () => Promise<RequestInput[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<RequestInput[]>(
        `${runtimeConfig.public.API_BASE_URL}/internal/request-inputs`,
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
        throw new Error("No request inputs data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getRequestInputById: (id: string) => Promise<RequestInput> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<RequestInput>(
        `${runtimeConfig.public.API_BASE_URL}/internal/request-inputs/${id}`,
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
        throw new Error("No request input with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewRequestInput: (requestInputData: any) => Promise<RequestInput> = async (requestInputData) => {
    console.log("createNewRequestInput requestInputData: ", requestInputData);
    try {
      const { data, pending, error, status } = await useFetch<RequestInput>(
        `${runtimeConfig.public.API_BASE_URL}/internal/request-inputs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(requestInputData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

        console.log("Creating new request input error: ", error.value?.data.detail)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new request input error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new request input errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No request input received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateRequestInput: (requestInputId: string, requestInputData: any) => Promise<RequestInput> = async (requestInputId, requestInputData) => {
    try {
      const { data, pending, error, status } = await useFetch<RequestInput>(
        `${runtimeConfig.public.API_BASE_URL}/internal/request-inputs/${requestInputId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(requestInputData),
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
          console.log("Updating request input error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating request input errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No request input with this request input id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteRequestInput: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/internal/request-inputs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
          console.log("Deleting request input error: ", error.value?.data?.message)
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message,
          variant: "destructive"
        })
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };


  return {
    isLoading,
    getRequestInputs,
    getRequestInputById,
    createNewRequestInput,
    deleteRequestInput,
    updateRequestInput,
    isSubmitting
  };
};
