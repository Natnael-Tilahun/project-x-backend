import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";

export const usePaymentIntegrations = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getPaymentIntegrations: () => Promise<PaymentIntegration[]> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentIntegration[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-integrations`,
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
        throw new Error("No payment integrations data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getPaymentIntegrationById: (id: string) => Promise<PaymentIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentIntegration>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-integrations/${id}`,
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
        throw new Error("No payment integration with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewPaymentIntegration: (paymentIntegrationData: any) => Promise<PaymentIntegration> = async (paymentIntegrationData) => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentIntegration>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-integrations`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(paymentIntegrationData),
        },
      );

      isLoading.value = pending.value;

      if (status.value === "error") {

        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" ? error.value?.data?.fieldErrors[0]?.message : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        })

        console.log("Creating new payment integration error: ", error.value)

        if (error.value?.data?.type == "/constraint-violation") {
          console.log("Creating new payment integration error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Creating new payment integration errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value);
      }

      if (!data.value) {
        throw new Error("No payment integration received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updatePaymentIntegration: (paymentIntegrationId: string, paymentIntegrationData: any) => Promise<PaymentIntegration> = async (paymentIntegrationId, paymentIntegrationData) => {
    try {
      const { data, pending, error, status } = await useFetch<PaymentIntegration>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-integrations/${paymentIntegrationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(paymentIntegrationData),
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
          console.log("Updating payment integration error: ", error.value?.data?.fieldErrors[0].message)
        }
        else {
          console.log("Updating payment integration errorrr: ", error.value?.data?.message)
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No payment integration with this payment integration id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deletePaymentIntegration: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/payment-integrations/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting payment integration error: ", error.value?.data?.message)
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
    getPaymentIntegrations,
    getPaymentIntegrationById,
    createNewPaymentIntegration,
    deletePaymentIntegration,
    updatePaymentIntegration,
    isSubmitting
  };
};
