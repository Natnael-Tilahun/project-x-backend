import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Merchant } from "~/types";

export const useMerchants = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getMerchants: (page?: number, size?: number) => Promise<Merchant[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant[]>(
        '/api/v1/internal/merchants',
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
        throw new Error("No merchants data received");
      }

      return data.value as unknown as Merchant[];
    } catch (err) {
      throw err;
    }
  };

  const getMerchantById: (id: string) => Promise<Merchant> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${id}`
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Merchant;
    } catch (err) {
      throw err;
    }
  };

  const createNeweMerchant: (customerId: string, merchantData: any) => Promise<Merchant> = async (customerId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${customerId}`,
        {
          method: "POST",
          body: merchantData
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
        throw new Error("No merchant with this customer id received");
      }

      return data.value as unknown as Merchant;
    } catch (err) {
      throw err;
    }
  };

  const updateMerchant: (customerId: string, merchantData: any) => Promise<Merchant> = async (customerId, merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Merchant>(
        `/api/v1/internal/merchants/${customerId}`,
        {
          method: "POST",
          body: merchantData
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
        throw new Error("No merchant with this merchant id received");
      }

      return data.value as unknown as Merchant;
    } catch (err) {
      throw err;
    }
  };

  const deleteMerchant: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/merchants/${id}`,
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
    getMerchants,
    getMerchantById,
    createNeweMerchant,
    deleteMerchant,
    updateMerchant,
    isSubmitting,
  };
};
