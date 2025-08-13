import type { CustomerGroupMember, PaymentIntegration, PaymentOperation, ThirdPartyTransactionDetail } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import axios from "axios";

export const usePaymentIntegrations = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getPaymentIntegrations: (
    page?: number,
    size?: number
  ) => ApiResult<PaymentIntegration[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<
        PaymentIntegration[]
      >("/api/v1/internal/payment-integrations", {
        params: { page, size },
      });

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value
        ? (data.value as unknown as PaymentIntegration[])
        : null;
    } catch (err) {
      throw err;
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
      throw err;
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
      throw err;
    }
  };

  const createNewPaymentIntegration: (
    paymentIntegrationData: any
  ) => ApiResult<PaymentIntegration> = async (paymentIntegrationData) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        "/api/v1/internal/payment-integrations",
        {
          method: "POST",
          body: paymentIntegrationData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err;
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
          body: paymentIntegrationData,
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err;
    }
  };

  const deletePaymentIntegration: (id: string) => ApiResult<any> = async (
    id
  ) => {
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
      throw err;
    }
  };

  const importPaymentIntegration: (
    formData: FormData,
    options?: { onUploadProgress?: (progressEvent: any) => void }
  ) => ApiResult<PaymentIntegration> = async (formData, options) => {
    try {
      if (options && options.onUploadProgress) {
        const runtimeConfig = useRuntimeConfig();
        const { getHeaders } = useApi();
        // Use axios for upload progress
        try {
          const response = await axios.post<PaymentIntegration>(
            `${__API_BASE_URL__}/api/v1/internal/payment-integrations/import-bulk`,
            formData,
            {
              headers: {
                ...getHeaders(true),
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: options.onUploadProgress,
            }
          );
          return response.data as unknown as PaymentIntegration;
        } catch (error: any) {
          throw error;
        }
      }
      // Default: use fetch
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        "/api/v1/internal/payment-integrations/import-bulk",
        {
          method: "POST",
          body: formData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err;
    }
  };

  const exportPaymentIntegration: (
    id: string
  ) => ApiResult<PaymentIntegration> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<PaymentIntegration>(
        `/api/v1/internal/payment-integrations/${id}/export`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as PaymentIntegration) : null;
    } catch (err) {
      throw err;
    }
  };

  const getThirdPartyPaymentTransactionsByPaymentIntegrationId: (
    id: string
  ) => ApiResult<ThirdPartyTransactionDetail[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ThirdPartyTransactionDetail[]>(
        `/api/v1/internal/third-party-payment-transactions/integration/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ThirdPartyTransactionDetail[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getThirdPartyPaymentTransactionsByDebitAccountNumberAndIntegrationId: (
    debitAccountNumber: string,
    id: string
  ) => ApiResult<ThirdPartyTransactionDetail[]> = async (debitAccountNumber, id) => {
    try {
      const { data, pending, error, status } = await fetch<ThirdPartyTransactionDetail[]>(
        `/api/v1/internal/third-party-payment-transactions/debit-account/${debitAccountNumber}/integration/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ThirdPartyTransactionDetail[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getThirdPartyPaymentTransactionsByCustomerIdAndIntegrationId: (
    customerId: string,
    id: string
  ) => ApiResult<ThirdPartyTransactionDetail[]> = async (customerId, id) => {
    try {
      const { data, pending, error, status } = await fetch<ThirdPartyTransactionDetail[]>(
        `/api/v1/internal/third-party-payment-transactions/customer/${customerId}/integration/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ThirdPartyTransactionDetail[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getTransactionsDetailsByTransactionId: (
    id: string
  ) => ApiResult<ThirdPartyTransactionDetail> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ThirdPartyTransactionDetail>(
        `/api/v1/internal/third-party-payment-transactions/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ThirdPartyTransactionDetail) : null;
    } catch (err) {
      throw err;
    }
  };


  const getThirdPartyPaymentTransactionsByCustomerId: (
    id: string
  ) => ApiResult<ThirdPartyTransactionDetail[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ThirdPartyTransactionDetail[]>(
        `/api/v1/internal/third-party-payment-transactions/customer/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ThirdPartyTransactionDetail[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getThirdPartyPaymentTransactionsByCoreTransactionId: (
    id: string
  ) => ApiResult<ThirdPartyTransactionDetail[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ThirdPartyTransactionDetail[]>(
        `/api/v1/internal/third-party-payment-transactions/core-transaction/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ThirdPartyTransactionDetail[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerGroupByIntegrationId: (id: string) => ApiResult<CustomerGroupMember> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(
        `/api/v1/internal/payment-integrations/${id}/groups`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err;
    }
  };

  const createCustomerGroupByIntegrationId: (id: string, groupData:any) => ApiResult<CustomerGroupMember> = async (id,groupData) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(
        `/api/v1/internal/payment-integrations/${id}/groups`,
        {
          method: "POST",
          body: groupData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteCustomerGroupByIntegrationId: (id: string, groupData:any) => ApiResult<CustomerGroupMember> = async (id,groupData) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(
        `/api/v1/internal/payment-integrations/${id}/groups`,
        {
          method: "DELETE",
          body: groupData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
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
    exportPaymentIntegration,
    importPaymentIntegration,
    getThirdPartyPaymentTransactionsByPaymentIntegrationId,
    getThirdPartyPaymentTransactionsByDebitAccountNumberAndIntegrationId,
    getThirdPartyPaymentTransactionsByCustomerId,
    getTransactionsDetailsByTransactionId,
    getCustomerGroupByIntegrationId,
    createCustomerGroupByIntegrationId,
    deleteCustomerGroupByIntegrationId,
    getThirdPartyPaymentTransactionsByCustomerIdAndIntegrationId,
    getThirdPartyPaymentTransactionsByCoreTransactionId,
    isSubmitting,
  };
};
