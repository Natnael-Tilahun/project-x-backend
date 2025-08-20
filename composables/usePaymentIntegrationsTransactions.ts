import type { CustomerGroupMember, PaymentIntegration, PaymentOperation, ThirdPartyTransactionDetail } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import axios from "axios";

export const usePaymentIntegrationsTransactions = (integrationId?: Ref<string>) => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const endpoint = computed(() => {
    if (!integrationId?.value) return null;
    return `/api/v1/internal/third-party-payment-transactions/integration/${integrationId.value}`;
  });

  const {
    page,
    size,
    sort,
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
  } = usePagination<PaymentIntegration>({endpoint,  sortValue:"lastModifiedDate,desc"});


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

  return {
    // Server pagination API
    page,
    size,
    sort,
    transactions: data,
    total,
    loading,
    error,
    fetchTransactions: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,

    isLoading,
    getThirdPartyPaymentTransactionsByPaymentIntegrationId,
    getThirdPartyPaymentTransactionsByDebitAccountNumberAndIntegrationId,
    getThirdPartyPaymentTransactionsByCustomerId,
    getTransactionsDetailsByTransactionId,
    getThirdPartyPaymentTransactionsByCustomerIdAndIntegrationId,
    getThirdPartyPaymentTransactionsByCoreTransactionId,
    isSubmitting,
  };
};
