import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { PaymentIntegration, PaymentOperation } from "~/types";
import { useApi } from "./useApi";

export const usePaymentIntegrations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getPaymentIntegrations: (
    page?: number,
    size?: number
  ) => Promise<PaymentIntegration[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration[]>(
        '/api/v1/internal/payment-integrations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No payment integrations data received");
      }

      return data.value as unknown as PaymentIntegration[];
    } catch (err) {
      throw err;
    }
  };

  const getPaymentIntegrationById: (
    id: string
  ) => Promise<PaymentIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        `/api/v1/internal/payment-integrations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No payment integration with this id received");
      }

      return data.value as unknown as PaymentIntegration;
    } catch (err) {
      throw err;
    }
  };

  const getPaymentIntegrationPaymentOperations: (
    id: string
  ) => Promise<PaymentOperation[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation[]>(
        `/api/v1/internal/payment-integrations/${id}/payment-operations`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error(
          "No payment operations with this payment integration id received"
        );
      }

      return data.value as unknown as PaymentOperation[];
    } catch (err) {
      throw err;
    }
  };

  const createNewPaymentIntegration: (
    paymentIntegrationData: any
  ) => Promise<PaymentIntegration> = async (paymentIntegrationData) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        '/api/v1/internal/payment-integrations',
        {
          method: "POST",
          body: paymentIntegrationData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No payment integration received");
      }

      return data.value as unknown as PaymentIntegration;
    } catch (err) {
      throw err;
    }
  };

  const updatePaymentIntegration: (
    paymentIntegrationId: string,
    paymentIntegrationData: any
  ) => Promise<PaymentIntegration> = async (
    paymentIntegrationId,
    paymentIntegrationData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        `/api/v1/internal/payment-integrations/${paymentIntegrationId}`,
        {
          method: "PATCH",
          body: paymentIntegrationData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error(
          "No payment integration with this payment integration id received"
        );
      }

      return data.value as unknown as PaymentIntegration;
    } catch (err) {
      throw err;
    }
  };

  const deletePaymentIntegration: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/payment-integrations/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
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
    getPaymentIntegrations,
    getPaymentIntegrationById,
    getPaymentIntegrationPaymentOperations,
    createNewPaymentIntegration,
    deletePaymentIntegration,
    updatePaymentIntegration,
    isSubmitting,
  };
};
