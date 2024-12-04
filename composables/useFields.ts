import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const useFields = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getFields: () => Promise<Field[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<Field[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/fields`,
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
        throw new Error("No fields data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getFieldById: (id: string) => Promise<Field> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<Field>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/fields/${id}`,
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
        throw new Error("No field with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewField: (fieldData: any) => Promise<Field> = async (fieldData) => {
    try {
      const { data, pending, error, status } = await useFetch<Field>(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/fields`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(fieldData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

          console.log("Creating new field error: ", error.value?.data.detail)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new field error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new field errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No field received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateField: (fieldId: string, fieldData: any) => Promise<Field> = async (fieldId, fieldData) => {
    try {
      const { data, pending, error, status } = await useFetch<Field>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/fields/${fieldId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(fieldData),
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
          console.log("Updating field error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating field errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No field with this field id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteField: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
          `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/fields/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting field error: ", error.value?.data?.message)
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
    getFields,
    getFieldById,
    createNewField,
    deleteField,
    updateField,
    isSubmitting
  };
};
