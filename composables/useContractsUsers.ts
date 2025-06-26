import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, ContractUser, Permission } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useContractsUsers = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContractUsers: (
    page?: number,
    size?: number
  ) => ApiResult<ContractUser[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser[]>(
        '/api/v1/internal/contract-users',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getContractUserById: (contractUserId: string) => ApiResult<ContractUser> = async (contractUserId) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser>(
        `/api/v1/internal/contract-users/${contractUserId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser) : null;
    } catch (err) {
      throw err
    }
  };

  const getContractUserByContractId: (contractId: string) => ApiResult<ContractUser[]> = async (contractId) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser[]>(
        `/api/v1/internal/contracts/${contractId}/contract-users`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser[]) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewContractForExistingUser: (
    contractId: string,
    contractUserData: any
  ) => ApiResult<ContractUser> = async (contractId, contractUserData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser>(
        `/api/v1/internal/contracts/${contractId}/contract-users/add-existing`,
        {
          method: "POST",
          body: contractUserData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewContractForNewUser: (
    contractId: string,
    contractUserData: any
  ) => ApiResult<ContractUser> = async (contractId, contractUserData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser>(
        `/api/v1/internal/contracts/${contractId}/contract-users/create-new`,
        {
          method: "POST",
          body: contractUserData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser) : null;
    } catch (err) {
      throw err
    }
  };

  const updateContractUser: (
    contractUserId: string,
    contractUserData: any
  ) => ApiResult<ContractUser> = async (contractUserId, contractUserData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser>(
        `/api/v1/internal/contract-users/${contractUserId}`,
        {
          method: "PATCH",
          body: contractUserData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteContractUser: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contract-users/${id}`,
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

  const addUserAccounts: (
    contractUserId: string,
    accountIds: any
  ) => ApiResult<ContractUser> = async (contractUserId, accountIds) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser>(
        `/api/v1/internal/contract-users/${contractUserId}/add-contract-accounts`,
        {
          method: "POST",
          body: accountIds
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractUser) : null;
    } catch (err) {
      throw err
    }
  };

  const getContractUserPermissions: (
    id: string
  ) => ApiResult<Permission[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-users/${id}/permissions`
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

  const createContractCoreCustomerUserPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-users/${id}/permissions`,
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

  const deleteContractCoreCustomerUserPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contract-users/${id}/permissions`,
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
    getContractUsers,
    getContractUserById,
    getContractUserByContractId,
    createNewContractForNewUser,
    deleteContractUser,
    updateContractUser,
    addUserAccounts,
    createNewContractForExistingUser,
    getContractUserPermissions,
    createContractCoreCustomerUserPermission,
    deleteContractCoreCustomerUserPermission,
    isSubmitting,
  };
};
