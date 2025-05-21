import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Customer, Device, User, UserInput } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useUsers = () => {
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      handleApiError(err);
      return null;
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

      return data.value ? (data.value as unknown as User) : null;
    } catch (err) {
      handleApiError(err);
      return null;
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

      return data.value;
    } catch (err) {
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    getUsers,
    getUserById,
    getUserByUsername,
    getUserInfo,
    getUserAvailability,
    getUserAvailabilityByPhoneNumber,
    getUserAvailabilityByEmail,
    getCoreAccountsByCustomerId,
    resetUserPin,
    createNewUser,
    deleteUserById,
    searchUsers,
    getUserDevices,
    getUserDevicesByDeviceId,
    suspendDevicesByDeviceId,
    restoreDevicesByDeviceId,
  };
};


