import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { CoreCustomerSummery, Customer, Device, User } from "~/types";

export const useCustomers = () => {
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();
  const { pageNumber, pageSize } = usePagesInfoStore();
  const pageNumbers = ref<number>(pageNumber);
  const pageSizes = ref<number>(pageSize);

  const getCustomers: (page?: number, size?: number) => Promise<any> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Customer[]>(
        '/api/v1/internal/customers/list',
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
        throw new Error("No customers data received");
      }

      return data.value as unknown as Customer[];
    } catch (err) {
      throw err;
    }
  };

  const getCustomerById: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}`
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const getCoreCustomerByAccountNumber: (accountNumber: string) => Promise<Customer> = async (accountNumber) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/core/${accountNumber}`
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const getCoreAccountsByCustomerId: (customerId: string) => Promise<Customer> = async (customerId) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/core/accounts/customer/${customerId}`
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
        throw new Error("No account with this customer id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const getCoreAccountsByAccount: (accountNumber: number) => Promise<CoreCustomerSummery> = async (accountNumber) => {
    try {
      const { data, pending, error, status } = await fetch<CoreCustomerSummery>(
        `/api/v1/internal/contract-core-customers/by-core-account-number/${accountNumber}`
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
        throw new Error("No account with this account number received");
      }

      return data.value as unknown as CoreCustomerSummery;
    } catch (err) {
      throw err;
    }
  };

  const searchCustomers: (keyword: string) => Promise<any> = async (keyword) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        '/api/v1/internal/customers/search',
        {
          params: { keyword }
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

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const activateCustomerById: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/activate-customer`,
        { method: "POST" }
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const deActivateCustomerById: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/deactivate-customer`,
        { method: "POST" }
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const linkCoreBankCustomer: (id: string, coreCustomerId: string) => Promise<Customer> = async (id, coreCustomerId) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/link-core-bank-customer`,
        {
          method: "POST",
          body: { coreCustomerId }
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const unLinkCoreBankCustomer: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/unlink-core-bank-customer`,
        { method: "POST" }
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const resetPin: (id: string) => Promise<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/reset-pin`,
        { method: "POST" }
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const createNeweCustomer: (customerData: any) => Promise<Customer> = async (customerData) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        '/api/v1/internal/customers/create',
        {
          method: "POST",
          body: customerData
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
        throw new Error("No customer with this id received");
      }

      return data.value as unknown as Customer;
    } catch (err) {
      throw err;
    }
  };

  const deleteCustomerById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/customers/delete/${id}`,
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

  const getCustomerDevices: (customerId: string) => Promise<Device[]> = async (customerId) => {
    try {
      const { data, pending, error, status } = await fetch<Device[]>(
        `/api/v1/internal/customers/${customerId}/devices`
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
        throw new Error("No devices with this customer id received");
      }

      return data.value as unknown as Device[];
    } catch (err) {
      throw err;
    }
  };

  const getCustomerDevicesByDeviceId: (customerId: string, deviceId: string) => Promise<User> = async (customerId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/customers/${customerId}/devices/${deviceId}`
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
        throw new Error("No device with this customer id and device id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const suspendCustomerDevicesByDeviceId: (customerId: string, deviceId: string) => Promise<User> = async (customerId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/customers/${customerId}/devices/${deviceId}/suspend`,
        { method: "POST" }
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
        throw new Error("No device with this customer id and device id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const restoreCustomerDevicesByDeviceId: (customerId: string, deviceId: string) => Promise<User> = async (customerId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/customers/${customerId}/devices/${deviceId}/restore`,
        { method: "POST" }
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
        throw new Error("No device with this customer id and device id received");
      }

      return data.value as unknown as User;
    } catch (err) {
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
    getCustomerDevices,
    getCustomerDevicesByDeviceId,
    suspendCustomerDevicesByDeviceId,
    restoreCustomerDevicesByDeviceId,
    getCoreAccountsByAccount
  };
};
