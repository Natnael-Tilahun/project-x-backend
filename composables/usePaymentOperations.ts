import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { PaymentOperation } from "~/types";
import { useApi } from "./useApi";

export const usePaymentOperations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getPaymentOperations: (
    page?: number,
    size?: number
  ) => Promise<PaymentOperation[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation[]>(
        '/api/v1/internal/payment-operations',
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
        throw new Error("No payment operations data received");
      }

      return data.value as unknown as PaymentOperation[];
    } catch (err) {
      throw err;
    }
  };

  const getPaymentOperationById: (
    id: string
  ) => Promise<PaymentOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation>(
        `/api/v1/internal/payment-operations/${id}`
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
        throw new Error("No payment operation with this id received");
      }

      return data.value as unknown as PaymentOperation;
    } catch (err) {
      throw err;
    }
  };

  const createNewPaymentOperation: (
    operationData: any
  ) => Promise<PaymentOperation> = async (operationData) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation>(
        '/api/v1/internal/payment-operations',
        {
          method: "POST",
          body: operationData
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
        throw new Error("No payment operation received");
      }

      return data.value as unknown as PaymentOperation;
    } catch (err) {
      throw err;
    }
  };

  const updatePaymentOperation: (
    operationId: string,
    operationData: any
  ) => Promise<PaymentOperation> = async (operationId, operationData) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation>(
        `/api/v1/internal/payment-operations/${operationId}`,
        {
          method: "PATCH",
          body: operationData
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
        throw new Error("No payment operation with this operation id received");
      }

      return data.value as unknown as PaymentOperation;
    } catch (err) {
      throw err;
    }
  };

  const deletePaymentOperation: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/payment-operations/${id}`,
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
    getPaymentOperations,
    getPaymentOperationById,
    createNewPaymentOperation,
    deletePaymentOperation,
    updatePaymentOperation,
    isSubmitting,
  };
};
