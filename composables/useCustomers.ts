import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Customer } from "~/types";

export const useCustomers = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { pageNumber, pageSize } = usePagesInfoStore();
  const pageNumbers = ref<number>(pageNumber);
  const pageSizes = ref<number>(pageSize);

  const getCustomers: (page?: number,
    size?: number) => Promise<any> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/list?page=${page}&size=${size}`,
        {
              // params: {
              //   page: pageNumbers.value,
              //   size: pageSizes.value,
              // },
              method: "GET",
              headers: {
          Authorization: `Bearer ${store.accessToken}`,
        },
      });

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
        throw new Error("No customers data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getCustomerById: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/${id}`,
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getCoreCustomerByAccountNumber: (
    accountNumber: string
  ) => Promise<Customer> = async (accountNumber) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/core/${accountNumber}`,
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getCoreAccountsByCustomerId: (
    customerId: string
  ) => Promise<Customer> = async (customerId) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/core/accounts/customer/${customerId}`,
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
        throw new Error("No account with this customer id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const searchCustomers: (keyword: string) => Promise<any> = async (
    keyword
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/search?keyword=${keyword}`,
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

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const activateCustomerById: (id: string) => Promise<Customer> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/${id}/activate-customer`,
        {
          method: "POST",
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deActivateCustomerById: (id: string) => Promise<Customer> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/${id}/deactivate-customer`,
        {
          method: "POST",
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const linkCoreBankCustomer: (
    id: string,
    coreCustomerId: string
  ) => Promise<Customer> = async (id, coreCustomerId) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/${id}/link-core-bank-customer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: { coreCustomerId },
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const unLinkCoreBankCustomer: (id: string) => Promise<Customer> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/${id}/unlink-core-bank-customer`,
        {
          method: "POST",
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const resetPin: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/${id}/reset-pin`,
        {
          method: "POST",
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
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNeweCustomer: (customerData: any) => Promise<Customer> = async (
    customerData
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<Customer>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(customerData),
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

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new customer error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new customer errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No customer with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteCustomerById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/customers/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting customer error: ", error.value?.data?.message);
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
    getCustomers,
    getCustomerById,
    getCoreCustomerByAccountNumber,
    getCoreAccountsByCustomerId,
    activateCustomerById,
    deActivateCustomerById,
    linkCoreBankCustomer,
    unLinkCoreBankCustomer,
    resetPin,
    createNeweCustomer,
    deleteCustomerById,
    searchCustomers,
  };
};
