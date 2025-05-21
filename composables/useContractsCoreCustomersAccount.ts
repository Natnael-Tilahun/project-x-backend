import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, ContractAccount, ContractCoreCustomer } from "~/types";

export const useContractsCoreCustomersAccount = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContractCoreCustomerAccounts: (
    page?: number,
    size?: number
  ) => Promise<ContractAccount[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount[]>(
        '/api/v1/internal/contract-accounts',
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
        throw new Error("No contract accounts data received");
      }

      return data.value as unknown as ContractAccount[];
    } catch (err) {
      throw err;
    }
  };

  const getContractCoreCustomerAccountById: (id: string) => Promise<ContractAccount> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-accounts/${id}`
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
        throw new Error("No contract account with this id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const createNewContractCoreCustomerAccount: (
    contractCoreCustomerData: any
  ) => Promise<ContractAccount> = async (contractCoreCustomerData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        '/api/v1/internal/contract-accounts',
        {
          method: "POST",
          body: contractCoreCustomerData
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
        throw new Error("No contract account with this customer id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const updateContractCoreCustomerAccount: (
    contractAccountId: string,
    contractAccountData: any
  ) => Promise<ContractAccount> = async (contractAccountId, contractAccountData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-accounts/${contractAccountId}`,
        {
          method: "PATCH",
          body: contractAccountData
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
        throw new Error("No contract account with this contract account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const updateContractCoreCustomerAccountStatus: (
    contractAccountId: string,
    statusData: any
  ) => Promise<ContractAccount> = async (contractAccountId, statusData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-accounts/${contractAccountId}/${statusData}`,
        {
          method: "PATCH"
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
        throw new Error("No contract account with this contract account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const updateContractCoreCustomerAccountPermissions: (
    contractAccountId: string,
    permissionsData: any
  ) => Promise<ContractAccount> = async (contractAccountId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-core-customers/contract-accounts/${contractAccountId}/permissions`,
        {
          method: "PUT",
          body: permissionsData
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
        throw new Error("No contract account with this contract account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const deleteContractCoreCustomerAccount: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contract-accounts/${id}`,
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
    getContractCoreCustomerAccounts,
    getContractCoreCustomerAccountById,
    createNewContractCoreCustomerAccount,
    deleteContractCoreCustomerAccount,
    updateContractCoreCustomerAccountStatus,
    updateContractCoreCustomerAccountPermissions,
    isSubmitting,
  };
};

