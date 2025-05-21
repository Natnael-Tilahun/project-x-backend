import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, ContractAccount, ContractCoreCustomer } from "~/types";
import { useApi } from "./useApi";

export const useUserAccounts = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getUserAccounts: (
    page?: number,
    size?: number
  ) => Promise<ContractAccount[]> = async (page, size) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user accounts data received");
      }

      return data.value as unknown as ContractAccount[];
    } catch (err) {
      throw err;
    }
  };

  const getUserAccountById: (id: string) => Promise<ContractAccount> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/user-accounts/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const getUserAccountByContractUserId: (contractUserId: string) => Promise<ContractAccount[]> = async (contractUserId) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount[]>(
        `/api/v1/internal/user-accounts/${contractUserId}/list`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this contract user id received");
      }

      return data.value as unknown as ContractAccount[];
    } catch (err) {
      throw err;
    }
  };

  const createNewUserAccount: (
    userAccountData: any
  ) => Promise<ContractAccount> = async (userAccountData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this customer id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const updateUserAccount: (
    userAccountId: string,
    userAccountData: any
  ) => Promise<ContractAccount> = async (userAccountId, userAccountData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this user account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const updateUserAccountStatus: (
    userAccountId: string,
    statusData: any
  ) => Promise<ContractAccount> = async (userAccountId, statusData) => {
    try {
      const { data, pending, error, status } = await fetch<ContractAccount>(
        `/api/v1/internal/user-accounts/${userAccountId}/${statusData}`,
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
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this user account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const updateUserAccountPermissions: (
    userAccountId: string,
    permissionsData: any
  ) => Promise<ContractAccount> = async (userAccountId, permissionsData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this user account id received");
      }

      return data.value as unknown as ContractAccount;
    } catch (err) {
      throw err;
    }
  };

  const deleteUserAccount: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/user-accounts/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
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

