import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, ContractUser } from "~/types";

export const useContractsUsers = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getContractUsers: (
    page?: number,
    size?: number
  ) => Promise<ContractUser[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-users?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract users data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getContractUserById: (
    contractUserId: string
  ) => Promise<ContractUser> = async (contractUserId) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-users/${contractUserId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract user with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getContractUserByContractId: (
    contractId: string
  ) => Promise<ContractUser[]> = async (contractId) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contracts/${contractId}/contract-users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract user with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewContractForExistingUser: (
    contractId: string,
    contractUserData: any
  ) => Promise<ContractUser> = async (contractId, contractUserData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contracts/${contractId}/contract-users/add-existing`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(contractUserData),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log(
          "Creating new contract user error: ",
          error.value?.data.detail
        );

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new contract user error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new contract user errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No contract user with this contract user id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewContractForNewUser: (
    contractId: string,
    contractUserData: any
  ) => Promise<ContractUser> = async (contractId, contractUserData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contracts/${contractId}/contract-users/create-new`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(contractUserData),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log(
          "Creating new contract and new user error: ",
          error.value?.data.detail
        );

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new contract user error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new contract and new user errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No contract user with this contract user id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateContractUser: (
    contractUserId: string,
    contractUserData: any
  ) => Promise<ContractUser> = async (contractUserId, contractUserData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-users/${contractUserId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(contractUserData),
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Updating contract user error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating contract user errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No contract user with this contract user id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteContractUser: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log(
          "Deleting contract user error: ",
          error.value?.data?.message
        );
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const addUserAccounts: (
    contractUserId: string,
    accountIds: any
  ) => Promise<ContractUser> = async (contractUserId, accountIds) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractUser>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-users/${contractUserId}/add-contract-accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(accountIds),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log("Adding user accounts error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Adding user accounts error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Adding user accounts errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No contract user with this contract user id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
