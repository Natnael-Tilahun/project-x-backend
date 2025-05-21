import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Customer, Device, User, UserInput } from "~/types";
import { useApi } from "./useApi";

export const useUsers = () => {
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();

  const getUsers: (pageNumber: number, pageSize: number) => Promise<User[]> = async (pageNumber, pageSize) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No users data received");
      }

      return data.value as unknown as User[];
    } catch (err) {
      throw err;
    }
  };

  const getUserById: (id: string) => Promise<User> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const getUserByUsername: (username: string) => Promise<User> = async (username) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${username}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this username received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const getUserInfo: (phoneNumber: string) => Promise<User> = async (phoneNumber) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        '/api/v1/internal/users/user-info',
        {
          params: { phoneNumber }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this phone number received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const getUserAvailability: (phoneNumber: string, email: string) => Promise<User> = async (phoneNumber, email) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        '/api/v1/internal/users/users-availability',
        {
          params: { phoneNumber, email }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this phone number and email received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const getUserAvailabilityByPhoneNumber: (phoneNumber: string) => Promise<User> = async (phoneNumber) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/users-availability/${phoneNumber}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this phone number received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const getUserAvailabilityByEmail: (email: string) => Promise<User> = async (email) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/users-availability/${email}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this email received");
      }

      return data.value as unknown as User;
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
          variant: "destructive"
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

  const searchUsers: (keyword: string) => Promise<User[]> = async (keyword) => {
    try {
      const { data, pending, error, status } = await fetch<User[]>(
        '/api/v1/internal/users/search',
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
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value as unknown as User[];
    } catch (err) {
      throw err;
    }
  };

  const resetUserPin: (id: string) => Promise<User> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${id}/reset-pin`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const createNewUser: (userData: UserInput) => Promise<User> = async (userData) => {
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
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No user with this id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const deleteUserById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/users/delete/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const getUserDevices: (userId: string) => Promise<Device[]> = async (userId) => {
    try {
      const { data, pending, error, status } = await fetch<Device[]>(
        `/api/v1/internal/users/${userId}/devices`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No devices with this user id received");
      }

      return data.value as unknown as Device[];
    } catch (err) {
      throw err;
    }
  };

  const getUserDevicesByDeviceId: (userId: string, deviceId: string) => Promise<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${userId}/devices/${deviceId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No device with this user id and device id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const suspendDevicesByDeviceId: (userId: string, deviceId: string) => Promise<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${userId}/devices/${deviceId}/suspend`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No device with this user id and device id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
    }
  };

  const restoreDevicesByDeviceId: (userId: string, deviceId: string) => Promise<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await fetch<User>(
        `/api/v1/internal/users/${userId}/devices/${deviceId}/restore`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No device with this user id and device id received");
      }

      return data.value as unknown as User;
    } catch (err) {
      throw err;
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


