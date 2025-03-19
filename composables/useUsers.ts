import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Customer, Device, User, UserInput } from "~/types";

export const useUsers = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  // const { pageNumber, pageSize } = usePagesInfoStore();

  const getUsers: (pageNumber: number, pageSize: number) => Promise<User[]> = async (pageNumber, pageSize) => {
    try {
      const { data, pending, error, status } = await useFetch<User[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users?page=${pageNumber}&size=${pageSize}`,
        {
              params: {
                page: pageNumber,
                size: pageSize,
              },
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
        throw new Error("No users data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserById: (id: string) => Promise<User> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/${id}`,
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
          throw new Error("No user with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserByUsername: (
    username: string
  ) => Promise<User> = async (username) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/${username}`,
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
        throw new Error("No user with this username received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserInfo: (
    phoneNumber: string
  ) => Promise<User> = async (phoneNumber) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/user-info?phoneNumber=${phoneNumber}`,
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
        throw new Error("No user with this phone number received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserAvailability: (
    phoneNumber: string,
    email: string
  ) => Promise<User> = async (phoneNumber, email) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/users-availability?phoneNumber=${phoneNumber}&email=${email}`,
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
        throw new Error("No user with this phone number and email received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserAvailabilityByPhoneNumber: (
    phoneNumber: string
  ) => Promise<User> = async (phoneNumber) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/users-availability/${phoneNumber}`,
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
        throw new Error("No user with this phone number received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserAvailabilityByEmail: (
    email: string
  ) => Promise<User> = async (email) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/users-availability/${email}`,
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
        throw new Error("No user with this email received");
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

  const searchUsers: (keyword: string) => Promise<any> = async (
    keyword
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/search?keyword=${keyword}`,
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

  const resetUserPin: (id: string) => Promise<User> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/${id}/reset-pin`,
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
        throw new Error("No user with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewUser: (userData: UserInput) => Promise<User> = async (
    userData
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(userData),
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
            "Creating new user error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new user errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No user with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteUserById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting user error: ", error.value?.data?.message);
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

  const getUserDevices: (
    userId: string
  ) => Promise<Device[]> = async (userId) => {
    try {
      const { data, pending, error, status } = await useFetch<Device[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/${userId}/devices`,
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
        throw new Error("No devices with this user id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getUserDevicesByDeviceId: (
    userId: string,
    deviceId: string
  ) => Promise<User> = async (userId, deviceId) => {
    try {
      const { data, pending, error, status } = await useFetch<User>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/users/${userId}/devices/${deviceId}`,
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
        throw new Error("No device with this user id and device id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
  };
};


