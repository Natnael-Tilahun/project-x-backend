import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, ContractAccount, ContractCoreCustomer } from "~/types";

export const useContractsCoreCustomers = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getContractCoreCustomers: (
    page?: number,
    size?: number
  ) => Promise<ContractCoreCustomer[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractCoreCustomer[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers?page=${page}&size=${size}`,
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
        throw new Error("No contract core customers data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getContractCoreCustomerById: (contractId: string, id: string) => Promise<ContractCoreCustomer> = async (contractId, id) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractCoreCustomer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers/${id}`,
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
        throw new Error("No contract core customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewContractCoreCustomer: (
    contractId: string,
    contractCoreCustomerData: any
  ) => Promise<ContractCoreCustomer> = async (contractId, contractCoreCustomerData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractCoreCustomer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contracts/${contractId}/core-customers/batch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(contractCoreCustomerData),
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

        console.log("Creating new contract core customer error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new contract core customer error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new contract core customer errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No contract core customer with this customer id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateContractCoreCustomerStatus: (
      contractCoreCustomerId: string,
    statusData: any
  ) => Promise<ContractCoreCustomer> = async (contractCoreCustomerId, statusData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractCoreCustomer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/${statusData}`,
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
            "Updating contract core customer error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating contract core customer errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No contract core customer with this contract core customer id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateContractCoreCustomerPermissions: (
    contractCoreCustomerId: string,
    permissionsData: any
  ) => Promise<ContractCoreCustomer> = async (contractCoreCustomerId, permissionsData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractCoreCustomer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/permissions`,
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
            "Updating contract core customer error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating contract core customer errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No contract core customer with this contract core customer id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateContractAccountsPermissions: (
    contractAccountId: string,
    permissionsData: any,
  ) => Promise<ContractAccount> = async (contractAccountId, permissionsData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers/contract-accounts/${contractAccountId}/permissions`,
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
            "Updating contract account error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating contract account errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No contract account with this contract account id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteContractCoreCustomer: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting contract core customer error: ", error.value?.data?.message);
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

  const createNewContractAccount: (
    contractCoreCustomerId: string,
    contractAccountData: any
  ) => Promise<ContractAccount> = async (contractCoreCustomerId, contractAccountData) => {
    try {
      const { data, pending, error, status } = await useFetch<ContractAccount>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/contract-core-customers/${contractCoreCustomerId}/contract-accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(contractAccountData),
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

        console.log("Creating new contract account error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new contract account error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new contract account errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No contract account with this contract account id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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

