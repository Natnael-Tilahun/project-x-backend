import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, ContractUser } from "~/types";

export const useContractsUsers = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContractUsers: (
    page?: number,
    size?: number
  ) => Promise<ContractUser[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser[]>(
        '/api/v1/internal/contract-users',
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
        throw new Error("No contract users data received");
      }

      return data.value as unknown as ContractUser[];
    } catch (err) {
      throw err;
    }
  };

  const getContractUserById: (contractUserId: string) => Promise<ContractUser> = async (contractUserId) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser>(
        `/api/v1/internal/contract-users/${contractUserId}`
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
        throw new Error("No contract user with this id received");
      }

      return data.value as unknown as ContractUser;
    } catch (err) {
      throw err;
    }
  };

  const getContractUserByContractId: (contractId: string) => Promise<ContractUser[]> = async (contractId) => {
    try {
      const { data, pending, error, status } = await fetch<ContractUser[]>(
        `/api/v1/internal/contracts/${contractId}/contract-users`
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
        throw new Error("No contract user with this id received");
      }

      return data.value as unknown as ContractUser[];
    } catch (err) {
      throw err;
    }
  };

  const createNewContractForExistingUser: (
    contractId: string,
    contractUserData: any
  ) => Promise<ContractUser> = async (contractId, contractUserData) => {
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
        throw new Error("No contract user with this contract user id received");
      }

      return data.value as unknown as ContractUser;
    } catch (err) {
      throw err;
    }
  };

  const createNewContractForNewUser: (
    contractId: string,
    contractUserData: any
  ) => Promise<ContractUser> = async (contractId, contractUserData) => {
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
        throw new Error("No contract user with this contract user id received");
      }

      return data.value as unknown as ContractUser;
    } catch (err) {
      throw err;
    }
  };

  const updateContractUser: (
    contractUserId: string,
    contractUserData: any
  ) => Promise<ContractUser> = async (contractUserId, contractUserData) => {
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
        throw new Error("No contract user with this contract user id received");
      }

      return data.value as unknown as ContractUser;
    } catch (err) {
      throw err;
    }
  };

  const deleteContractUser: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contract-users/${id}`,
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

  const addUserAccounts: (
    contractUserId: string,
    accountIds: any
  ) => Promise<ContractUser> = async (contractUserId, accountIds) => {
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
        throw new Error("No contract user with this contract user id received");
      }

      return data.value as unknown as ContractUser;
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
    isSubmitting,
  };
};
