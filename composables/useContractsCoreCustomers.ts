import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, ContractAccount, ContractCoreCustomer, Permission } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useContractsCoreCustomers = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContractCoreCustomers: (
    contractId?: string,
    page?: number,
    size?: number,
  ) => ApiResult<ContractCoreCustomer[]> = async (contractId, page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer[]>(
        `/api/v1/internal/contracts/${contractId}/core-customers`,
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractCoreCustomer[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getContractCoreCustomerById: (contractId: string, id: string) => ApiResult<ContractCoreCustomer> = async (contractId, id) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer>(
        `/api/v1/internal/contract-core-customers/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractCoreCustomer) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewContractCoreCustomer: (
    contractId: string,
    contractCoreCustomerData: any
  ) => ApiResult<ContractCoreCustomer> = async (contractId, contractCoreCustomerData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractCoreCustomer) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateContractCoreCustomerStatus: (
    contractCoreCustomerId: string,
    statusData: any
  ) => ApiResult<ContractCoreCustomer> = async (contractCoreCustomerId, statusData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractCoreCustomer>(
        `/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/${statusData}`,
        {
          method: "PATCH"
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractCoreCustomer) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };


  const updateContractAccountsPermissions: (
    contractAccountId: string,
    permissionsData: any,
  ) => ApiResult<ContractAccount> = async (contractAccountId, permissionsData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteContractCoreCustomer: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contract-core-customers/${id}`,
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

  const createNewContractAccount: (
    contractCoreCustomerId: string,
    contractAccountData: any
  ) => ApiResult<ContractAccount> = async (contractCoreCustomerId, contractAccountData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getContractCoreCustomerPermissions: (
    id: string
  ) => ApiResult<Permission[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-core-customers/${id}/permissions`
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

  const createContractCoreCustomerPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-core-customers/${id}/permissions`,
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

  const deleteContractCoreCustomerPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-core-customers/${id}/permissions`,
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
    getContractCoreCustomers,
    getContractCoreCustomerById,
    createNewContractCoreCustomer,
    deleteContractCoreCustomer,
    updateContractCoreCustomerStatus,
    updateContractAccountsPermissions,
    createNewContractAccount,
    getContractCoreCustomerPermissions,
    createContractCoreCustomerPermission,
    deleteContractCoreCustomerPermission,
    isSubmitting,
  };
};

