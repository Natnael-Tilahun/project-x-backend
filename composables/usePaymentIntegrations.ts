import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { PaymentIntegration, PaymentOperation } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const usePaymentIntegrations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getPaymentIntegrations: (
    page?: number,
    size?: number
  ) => ApiResult<PaymentIntegration[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration[]>(
        '/api/v1/internal/payment-integrations',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getPaymentIntegrationById: (
    id: string
  ) => ApiResult<PaymentIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        `/api/v1/internal/payment-integrations/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err
    }
  };

  const getPaymentIntegrationPaymentOperations: (
    id: string
  ) => ApiResult<PaymentOperation[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentOperation[]>(
        `/api/v1/internal/payment-integrations/${id}/payment-operations`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentOperation[]) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewPaymentIntegration: (
    paymentIntegrationData: any
  ) => ApiResult<PaymentIntegration> = async (paymentIntegrationData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err
    }
  };

  const updatePaymentIntegration: (
    paymentIntegrationId: string,
    paymentIntegrationData: any
  ) => ApiResult<PaymentIntegration> = async (
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err
    }
  };

  const deletePaymentIntegration: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/payment-integrations/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const importPaymentIntegration: (formData: FormData) => ApiResult<PaymentIntegration> = async (formData) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        '/api/v1/internal/payment-integrations/import-bulk',
        {
          method: "POST",
          body:  formData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err
    }
  };

  const exportPaymentIntegration: (id:string) => ApiResult<PaymentIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        `/api/v1/internal/payment-integrations/${id}/export`,
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err
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
    exportPaymentIntegration,
    importPaymentIntegration,
    isSubmitting,
  };
};
