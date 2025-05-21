import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { BankingService, Contract } from "~/types";

export const useBankingServices = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getBankingServices: (page?: number, size?: number) => Promise<BankingService[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<BankingService[]>(
        '/api/v1/internal/banking-services',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No banking services data received");
      }

      return data.value as unknown as BankingService[];
    } catch (err) {
      throw err;
    }
  };

  const getBankingServiceById: (id: string) => Promise<BankingService> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<BankingService>(
        `/api/v1/internal/banking-services/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No banking service with this id received");
      }

      return data.value as unknown as BankingService;
    } catch (err) {
      throw err;
    }
  };

  const createNewBankingService: (bankingServiceData: any) => Promise<BankingService> = async (bankingServiceData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No banking service with this id received");
      }

      return data.value as unknown as BankingService;
    } catch (err) {
      throw err;
    }
  };

  const updateBankingService: (bankingServiceId: string, bankingServiceData: any) => Promise<BankingService> = async (bankingServiceId, bankingServiceData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No banking service with this banking service id received");
      }

      return data.value as unknown as BankingService;
    } catch (err) {
      throw err;
    }
  };

  const deleteBankingService: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/banking-services/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
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
    getBankingServices,
    getBankingServiceById,
    createNewBankingService,
    deleteBankingService,
    updateBankingService,
    isSubmitting,
  };
};
