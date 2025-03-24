import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, ContractAccount, ContractCoreCustomer } from "~/types";

export const useUserAccounts = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getUserAccounts: (
    page?: number,
    size?: number
  ) => Promise<ContractAccount[]> = async ( page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts?page=${page}&size=${size}`,
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
        throw new Error("No user accounts data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserAccountById: (id: string) => Promise<ContractAccount> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts/${id}`,
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
        throw new Error("No user account with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserAccountByContractUserId: (contractUserId: string) => Promise<ContractAccount> = async (contractUserId) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts/${contractUserId}/list`,
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
        throw new Error("No user account with this contract user id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUserAccount: (
    userAccountData: any
  ) => Promise<ContractAccount> = async (userAccountData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(userAccountData),
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

        console.log("Creating new user account error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new user account error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new user account errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No user account with this customer id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUserAccount: (
    userAccountId: string,
    userAccountData: any
  ) => Promise<ContractAccount> = async (userAccountId, userAccountData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts/${userAccountId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(userAccountData),
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
            "Updating user account error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating user account errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No user account with this user account id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUserAccountStatus: (
    userAccountId: string,
    statusData: any
  ) => Promise<ContractAccount> = async (userAccountId, statusData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts/${userAccountId}/${statusData}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
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
            "Updating user account error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating user account errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No user account with this user account id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateUserAccountPermissions: (
    userAccountId: string,
    permissionsData: any
  ) => Promise<ContractAccount> = async (userAccountId, permissionsData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts/${userAccountId}/permissions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(permissionsData),
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
            "Updating user account permissions error: ",
            error.value?.data?.fieldErrors[0].message
          ); 
          
        } else {
          console.log(
            "Updating user account permissions errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
          throw new Error("No user account with this user account id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUserAccount: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/user-accounts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting user account error: ", error.value?.data?.message);
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

