import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { CoreCustomerSummery, Customer, Device, LoginHistory, User } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useCustomers = () => {
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();
  const { pageNumber, pageSize } = usePagesInfoStore();
  const pageNumbers = ref<number>(pageNumber);
  const pageSizes = ref<number>(pageSize);

  const getCustomers: (
    page?: number,
    size?: number
  ) => ApiResult<Customer[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Customer[]>(
        "/api/v1/internal/customers/list",
        {
          params: { page, size },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerById: (id: string) => ApiResult<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCoreCustomerByAccountNumber: (
    accountNumber: string
  ) => ApiResult<Customer> = async (accountNumber) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/core/${accountNumber}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCoreAccountsByCustomerId: (
    customerId: string
  ) => ApiResult<Customer> = async (customerId) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/core/accounts/customer/${customerId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCoreAccountsByAccount: (
    accountNumber: number
  ) => ApiResult<CoreCustomerSummery> = async (accountNumber) => {
    try {
      const { data, pending, error, status } = await fetch<CoreCustomerSummery>(
        `/api/v1/internal/contract-core-customers/by-core-account-number/${accountNumber}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CoreCustomerSummery) : null;
    } catch (err) {
      throw err;
    }
  };

  const searchCustomers: (keyword: string) => ApiResult<any> = async (
    keyword
  ) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        "/api/v1/internal/customers/search",
        {
          params: { keyword },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const activateCustomerById: (id: string) => ApiResult<Customer> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/activate-customer`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const deActivateCustomerById: (id: string) => ApiResult<Customer> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/deactivate-customer`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const linkCoreBankCustomer: (
    id: string,
    coreCustomerId: string
  ) => ApiResult<Customer> = async (id, coreCustomerId) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/link-core-bank-customer`,
        {
          method: "POST",
          body: { coreCustomerId },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const unLinkCoreBankCustomer: (id: string) => ApiResult<Customer> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/unlink-core-bank-customer`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const resetPin: (id: string) => ApiResult<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/reset-pin`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const resetPassphrase: (id: string) => ApiResult<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/reset-passphrase`,
        { method: "GET" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const unlockCustomer: (id: string) => ApiResult<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}/unlock-customer`,
        { method: "GET" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };


  const createNeweCustomer: (customerData: any) => ApiResult<Customer> = async (
    customerData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        "/api/v1/internal/customers/create",
        {
          method: "POST",
          body: customerData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Customer) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteCustomerById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/customers/delete/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerDevices: (
    customerId: string
  ) => ApiResult<Device[]> = async (customerId) => {
    try {
      const { data, pending, error, status } = await fetch<Device[]>(
        `/api/v1/internal/customers/${customerId}/devices`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      // Convert the raw data before Vue's reactivity system processes it
      const rawData = JSON.parse(JSON.stringify(data.value));
      const devices = rawData
        ? rawData.map((device:Device) => ({
            ...device,
            id: device?.id?.toString(),
          }))
        : null;

      console.log("dddd: ", devices);

      return devices;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerLoginHistory: (
    customerId: string,
    options?: { page?: number; size?: number; sort?: string[] }
  ) => ApiResult<LoginHistory[]> = async (customerId, options = {}) => {
    try {
      const params: any = {};
      if (options.page !== undefined) params.page = options.page;
      if (options.size !== undefined) params.size = options.size;
      if (options.sort) params.sort = options.sort;

      const { data, pending, error, status } = await fetch<LoginHistory[]>(
        `/api/v1/internal/customers/${customerId}/login-history`,
        { params }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }
      return data.value ? (data.value as unknown as LoginHistory[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerDevicesByDeviceId: (
    customerId: string,
    deviceId: string
  ) => ApiResult<User> = async (customerId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/customers/${customerId}/devices/${deviceId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err;
    }
  };

  const suspendCustomerDevicesByDeviceId: (
    customerId: string,
    deviceId: string
  ) => ApiResult<User> = async (customerId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/customers/${customerId}/devices/${deviceId}/suspend`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err;
    }
  };

  const restoreCustomerDevicesByDeviceId: (
    customerId: string,
    deviceId: string
  ) => ApiResult<User> = async (customerId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/customers/${customerId}/devices/${deviceId}/restore`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
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
    resetPassphrase,
    unlockCustomer,
    createNeweCustomer,
    deleteCustomerById,
    searchCustomers,
    getCustomerDevices,
    getCustomerDevicesByDeviceId,
    suspendCustomerDevicesByDeviceId,
    restoreCustomerDevicesByDeviceId,
    getCoreAccountsByAccount,
    getCustomerLoginHistory
  };
};
