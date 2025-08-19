import type { Customer, Device, LoginHistory, User, UserInput } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

export const useUsers = () => {
  // Server pagination for users list
  const {
    page,
    size,
    sort,
    search,
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
    onSearchChange,
  } = usePagination<User>('/api/v1/internal/users');

  // Legacy loading for direct operations
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();

  const getUsers: (pageNumber: number, pageSize: number) => ApiResult<User[]> = async (pageNumber, pageSize) => {
    try {
      const { data, pending, error, status } = await fetch<User[]>(
        '/api/v1/internal/users',
        {
          params: {
            page: pageNumber,
            size: pageSize
          }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserById: (id: string) => ApiResult<User> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserByUsername: (username: string) => ApiResult<User> = async (username) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${username}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserInfo: (phoneNumber: string) => ApiResult<User> = async (phoneNumber) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        '/api/v1/internal/users/user-info',
        {
          params: { phoneNumber }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserAvailability: (phoneNumber: string, email: string) => ApiResult<User> = async (phoneNumber, email) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        '/api/v1/internal/users/users-availability',
        {
          params: { phoneNumber, email }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserAvailabilityByPhoneNumber: (phoneNumber: string) => ApiResult<User> = async (phoneNumber) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/users-availability/${phoneNumber}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserAvailabilityByEmail: (email: string) => ApiResult<User> = async (email) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/users-availability/${email}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getCoreAccountsByCustomerId: (customerId: string) => ApiResult<Customer> = async (customerId) => {
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
      throw err
    }
  };

  const searchUsers: (keyword: string) => ApiResult<User[]> = async (keyword) => {
    try {
      const { data, pending, error, status } = await fetch<User[]>(
        '/api/v1/internal/users/search',
        {
          params: { keyword }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User[]) : null;
    } catch (err) {
      throw err
    }
  };

  const resetUserPin: (id: string) => ApiResult<User> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${id}/reset-pin`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }
      await fetchData();
      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const unlockUser: (id: string) => ApiResult<User> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${id}/unlock`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }
      await fetchData();
      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err;
    }
  };

  const createNewUser: (userData: UserInput) => ApiResult<User> = async (userData) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        '/api/v1/internal/users',
        {
          method: "POST",
          body: userData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }
      await fetchData();
      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteUserById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/users/delete/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }
      await fetchData();
      return data.value;
    } catch (err) {
      throw err
    }
  };

  const getUserDevices: (userId: string) => ApiResult<Device[]> = async (userId) => {
    try {
      const { data, pending, error, status } = await fetch<Device[]>(
        `/api/v1/internal/users/${userId}/devices`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Device[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getUserDevicesByDeviceId: (userId: string, deviceId: string) => ApiResult<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${userId}/devices/${deviceId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const suspendDevicesByDeviceId: (userId: string, deviceId: string) => ApiResult<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${userId}/devices/${deviceId}/suspend`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const restoreDevicesByDeviceId: (userId: string, deviceId: string) => ApiResult<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${userId}/devices/${deviceId}/restore`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      throw err
    }
  };

  const getUsersLoginHistory: (
    customerId: string,
    options?: { page?: number; size?: number; sort?: string[] }
  ) => ApiResult<LoginHistory[]> = async (customerId, options = {}) => {
    try {
      const params: any = {};
      if (options.page !== undefined) params.page = options.page;
      if (options.size !== undefined) params.size = options.size;
      if (options.sort) params.sort = options.sort;
      const { data, pending, error, status } = await fetch<LoginHistory[]>(
        `/api/v1/internal/users/${customerId}/login-history`,
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

  return {
    // Server pagination API
    page,
    size,
    sort,
    search,
    users: data,
    total,
    loading,
    error,
    fetchUsers: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
    onSearchChange,

    // Legacy/auxiliary APIs
    isLoading: loading,
    getUsers,
    getUserById,
    getUserByUsername,
    getUserInfo,
    getUserAvailability,
    getUserAvailabilityByPhoneNumber,
    getUserAvailabilityByEmail,
    getCoreAccountsByCustomerId,
    resetUserPin,
    unlockUser,
    createNewUser,
    deleteUserById,
    searchUsers,
    getUserDevices,
    getUserDevicesByDeviceId,
    suspendDevicesByDeviceId,
    restoreDevicesByDeviceId,
    getUsersLoginHistory
  };
};


