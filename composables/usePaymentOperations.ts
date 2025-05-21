import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { PaymentOperation } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const usePaymentOperations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getPaymentOperations: (
    page?: number,
    size?: number
  ) => ApiResult<PaymentOperation[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation[]>(
        '/api/v1/internal/payment-operations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentOperation[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getPaymentOperationById: (
    id: string
  ) => ApiResult<PaymentOperation> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation>(
        `/api/v1/internal/payment-operations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentOperation) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewPaymentOperation: (
    operationData: any
  ) => ApiResult<PaymentOperation> = async (operationData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentOperation) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updatePaymentOperation: (
    operationId: string,
    operationData: any
  ) => ApiResult<PaymentOperation> = async (operationId, operationData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentOperation) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deletePaymentOperation: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/payment-operations/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      handleApiError(err);
      return null;
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
