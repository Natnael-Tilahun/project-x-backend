import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, ContractAccount, ContractCoreCustomer } from "~/types";

export const useContractsCoreCustomers = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContractCoreCustomers: (
    contractId?: string,
    page?: number,
    size?: number,
  ) => Promise<ContractCoreCustomer[]> = async (contractId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer[]>(
        `/api/v1/internal/contracts/${contractId}/core-customers`,
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
        throw new Error("No contract core customers data received");
      }

      return data.value as unknown as ContractCoreCustomer[];
    } catch (err) {
      throw err;
    }
  };

  const getContractCoreCustomerById: (contractId: string, id: string) => Promise<ContractCoreCustomer> = async (contractId, id) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer>(
        `/api/v1/internal/contract-core-customers/${id}`
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
        throw new Error("No contract core customer with this id received");
      }

      return data.value as unknown as ContractCoreCustomer;
    } catch (err) {
      throw err;
    }
  };

  const createNewContractCoreCustomer: (
    contractId: string,
    contractCoreCustomerData: any
  ) => Promise<ContractCoreCustomer> = async (contractId, contractCoreCustomerData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer>(
        `/api/v1/internal/contracts/${contractId}/core-customers/batch`,
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
        throw new Error("No contract core customer with this customer id received");
      }

      return data.value as unknown as ContractCoreCustomer;
    } catch (err) {
      throw err;
    }
  };

  const updateContractCoreCustomerStatus: (
    contractCoreCustomerId: string,
    statusData: any
  ) => Promise<ContractCoreCustomer> = async (contractCoreCustomerId, statusData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer>(
        `/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/${statusData}`,
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
        throw new Error("No contract core customer with this contract core customer id received");
      }

      return data.value as unknown as ContractCoreCustomer;
    } catch (err) {
      throw err;
    }
  };

  const updateContractCoreCustomerPermissions: (
    contractCoreCustomerId: string,
    permissionsData: any
  ) => Promise<ContractCoreCustomer> = async (contractCoreCustomerId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer>(
        `/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/permissions`,
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
        throw new Error("No contract core customer with this contract core customer id received");
      }

      return data.value as unknown as ContractCoreCustomer;
    } catch (err) {
      throw err;
    }
  };

  const updateContractAccountsPermissions: (
    contractAccountId: string,
    permissionsData: any,
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

  const deleteContractCoreCustomer: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contract-core-customers/${id}`,
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

  const createNewContractAccount: (
    contractCoreCustomerId: string,
    contractAccountData: any
  ) => Promise<ContractAccount> = async (contractCoreCustomerId, contractAccountData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/contract-accounts`,
        {
          method: "POST",
          body: contractAccountData
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
        throw new Error("No contract account with this contract account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  return {
    isLoading,
    getContractCoreCustomers,
    getContractCoreCustomerById,
    createNewContractCoreCustomer,
    deleteContractCoreCustomer,
    updateContractCoreCustomerStatus,
    updateContractCoreCustomerPermissions,
    updateContractAccountsPermissions,
    createNewContractAccount,
    isSubmitting,
  };
};

