import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { BankingService, Contract } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useBankingServices = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getBankingServices: (page?: number, size?: number) => ApiResult<BankingService[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<BankingService[]>(
        '/api/v1/internal/banking-services',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as BankingService[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getBankingServiceById: (id: string) => ApiResult<BankingService> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<BankingService>(
        `/api/v1/internal/banking-services/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as BankingService) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewBankingService: (bankingServiceData: any) => ApiResult<BankingService> = async (bankingServiceData) => {
    try {
      const { data, pending, error, status } = await fetch<BankingService>(
        '/api/v1/internal/banking-services',
        {
          method: "POST",
          body: bankingServiceData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as BankingService) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateBankingService: (bankingServiceId: string, bankingServiceData: any) => ApiResult<BankingService> = async (bankingServiceId, bankingServiceData) => {
    try {
      const { data, pending, error, status } = await fetch<BankingService>(
        `/api/v1/internal/banking-services/${bankingServiceId}`,
        {
          method: "PATCH",
          body: bankingServiceData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as BankingService) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteBankingService: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/banking-services/${id}`,
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
    getBankingServices,
    getBankingServiceById,
    createNewBankingService,
    deleteBankingService,
    updateBankingService,
    isSubmitting,
  };
};
