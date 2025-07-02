import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, ContractAccount, ContractCoreCustomer, Permission } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useContractsCoreCustomersAccount = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContractCoreCustomerAccounts: (
    page?: number,
    size?: number
  ) => ApiResult<ContractAccount[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount[]>(
        '/api/v1/internal/contract-accounts',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getContractCoreCustomerAccountById: (id: string) => ApiResult<ContractAccount> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-accounts/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewContractCoreCustomerAccount: (
    contractCoreCustomerData: any
  ) => ApiResult<ContractAccount> = async (contractCoreCustomerData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount) : null;
    } catch (err) {
      throw err
    }
  };

  const updateContractCoreCustomerAccount: (
    contractAccountId: string,
    contractAccountData: any
  ) => ApiResult<ContractAccount> = async (contractAccountId, contractAccountData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount) : null;
    } catch (err) {
      throw err
    }
  };

  const updateContractCoreCustomerAccountStatus: (
    contractAccountId: string,
    statusData: any
  ) => ApiResult<ContractAccount> = async (contractAccountId, statusData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/contract-accounts/${contractAccountId}/${statusData}`,
        {
          method: "PATCH"
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteContractCoreCustomerAccount: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contract-accounts/${id}`,
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

  const getContractCoreCustomerAccountPermissions: (
    id: string
  ) => ApiResult<Permission[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-accounts/${id}/permissions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const createContractCoreCustomerAccountPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-accounts/${id}/permissions`,
        {
          method: "POST",
          body: permissionsData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteContractCoreCustomerAccountPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-accounts/${id}/permissions`,
        {
          method: "DELETE",
          body: permissionsData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
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
    getContractCoreCustomerAccountPermissions,
    createContractCoreCustomerAccountPermission,
    deleteContractCoreCustomerAccountPermission,
    isSubmitting,
  };
};

