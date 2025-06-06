import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, ContractAccount, ContractCoreCustomer } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUserAccounts = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getUserAccounts: (
    page?: number,
    size?: number
  ) => ApiResult<ContractAccount[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount[]>(
        '/api/v1/internal/user-accounts',
        {
          params: {
            page,
            size
          }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getUserAccountById: (id: string) => ApiResult<ContractAccount> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/user-accounts/${id}`
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

  const getUserAccountByContractUserId: (contractUserId: string) => ApiResult<ContractAccount[]> = async (contractUserId) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount[]>(
        `/api/v1/internal/user-accounts/${contractUserId}/list`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ContractAccount[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewUserAccount: (
    userAccountData: any
  ) => ApiResult<ContractAccount> = async (userAccountData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        '/api/v1/internal/user-accounts',
        {
          method: "POST",
          body: userAccountData
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

  const updateUserAccount: (
    userAccountId: string,
    userAccountData: any
  ) => ApiResult<ContractAccount> = async (userAccountId, userAccountData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/user-accounts/${userAccountId}`,
        {
          method: "PATCH",
          body: userAccountData
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

  const updateUserAccountStatus: (
    userAccountId: string,
    statusData: any
  ) => ApiResult<ContractAccount> = async (userAccountId, statusData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/user-accounts/${userAccountId}/${statusData}`,
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
      handleApiError(err);
      return null;
    }
  };

  const updateUserAccountPermissions: (
    userAccountId: string,
    permissionsData: any
  ) => ApiResult<ContractAccount> = async (userAccountId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/user-accounts/${userAccountId}/permissions`,
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

  const deleteUserAccount: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/user-accounts/${id}`,
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
    getUserAccounts,
    getUserAccountById,
    createNewUserAccount,
    updateUserAccount,
    deleteUserAccount,
    updateUserAccountStatus,
    updateUserAccountPermissions,
    getUserAccountByContractUserId,
    isSubmitting,
  };
};

