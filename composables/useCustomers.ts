import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { CoreCustomerSummery, Customer, CustomerGroup, CustomerGroupMember, Device, LoginHistory, User } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination"; // Import usePagination

export const useCustomers = () => {
  const { page, size, sort, data, total, loading, error, fetchData, onPageChange, onSizeChange, onSortChange } = usePagination<Customer>('/api/v1/internal/customers/list', { autoFetch: false });

  // Removed isLoading ref and usePagesInfoStore related refs
  const { fetch } = useApi();
  const { toast } = useToast();

  // getCustomers function is replaced by usePagination's fetchData

  const getCustomerById: (id: string) => ApiResult<Customer> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Customer>(
        `/api/v1/internal/customers/${id}`
      );

      // Removed isLoading.value = pending.value;
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

      // Removed isLoading.value = pending.value;
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

      // Removed isLoading.value = pending.value;
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

      // Removed isLoading.value = pending.value;
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

      // Removed isLoading.value = pending.value;
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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

      // Removed isLoading.value = pending.value;
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

      // Removed isLoading.value = pending.value;
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
      const { data, pending, error, status } = await fetch<User>(`/api/v1/internal/customers/${customerId}/devices/${deviceId}`
      );

      // Removed isLoading.value = pending.value;
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
      const { data, pending, error, status } = await fetch<User>(`/api/v1/internal/customers/${customerId}/devices/${deviceId}/suspend`,
        { method: "POST" }
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
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
      const { data, pending, error, status } = await fetch<User>(`/api/v1/internal/customers/${customerId}/devices/${deviceId}/restore`,
        { method: "POST" }
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err;
    }
  };

  const getCustomerGroupByCustomerId: (id: string) => ApiResult<CustomerGroupMember> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(`/api/v1/internal/customers/${id}/groups`
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err;
    }
  };

  const createCustomerGroupByCustomerId: (id: string, groupData:any) => ApiResult<CustomerGroupMember> = async (id,groupData) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(`/api/v1/internal/customers/${id}/groups`,
        {
          method: "POST",
          body: groupData,
        }
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteCustomerGroupByCustomerId: (id: string, groupData:any) => ApiResult<CustomerGroupMember> = async (id,groupData) => {
    try {
      const { data, pending, error, status } = await fetch<CustomerGroupMember>(`/api/v1/internal/customers/${id}/groups`,
        {
          method: "DELETE",
          body: groupData,
        }
      );

      // Removed isLoading.value = pending.value;
      if (status.value === "error") {
        handleApiError(error);
      }
      fetchData(); // Refresh data after operation
      return data.value ? (data.value as unknown as CustomerGroupMember) : null;
    } catch (err) {
      throw err;
    }
  };

  return {
    page,
    size,
    sort,
    customers: data, // Alias data to customers
    total,
    loading,
    error,
    fetchCustomers: fetchData, // Alias fetchData
    onPageChange,
    onSizeChange,
    onSortChange,
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
    getCustomerLoginHistory,
    getCustomerGroupByCustomerId,
    createCustomerGroupByCustomerId,
    deleteCustomerGroupByCustomerId
  };
};