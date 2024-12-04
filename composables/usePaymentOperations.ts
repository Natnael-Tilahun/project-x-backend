import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const usePaymentOperations = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getPaymentOperations: () => Promise<PaymentOperation[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentOperation[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-operations`,
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
        throw new Error("No payment operations data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getPaymentOperationById: (id: string) => Promise<PaymentOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-operations/${id}`,
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
        throw new Error("No payment operation with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewPaymentOperation: (operationData: any) => Promise<PaymentOperation> = async (operationData) => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-operations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(operationData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

        console.log("Creating new payment operation error: ", error.value?.data.detail)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new payment operation error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new payment operation errorrr: ", error.value)
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No payment operation received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updatePaymentOperation: (operationId: string, operationData: any) => Promise<PaymentOperation> = async (operationId, operationData) => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentOperation>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-operations/${operationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(operationData),
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
          console.log("Updating payment operation error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating payment operation errorrr: ", error.value)
        }
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No payment operation with this operation id received");
      }

      return data.value;
    } catch (err) {
      console.log("Updating payment operation error: ", err)
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deletePaymentOperation: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-operations/${id}`,
        {
          method: "DELETE",
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

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };


  return {
    isLoading,
    getPaymentOperations,
    getPaymentOperationById,
    createNewPaymentOperation,
    deletePaymentOperation,
    updatePaymentOperation,
    isSubmitting
  };
};
