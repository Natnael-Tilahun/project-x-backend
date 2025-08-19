import type { Contract, Device, LoginHistory, Staff, User } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

export const useStaffs = () => {
  const {
    page,
    size,
    sort,
    data,
    total,
    loading,
    error,
    fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
  } = usePagination<Staff>("/api/v1/internal/staff");

  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getStaffs: (
    page?: number,
    size?: number
  ) => ApiResult<Staff[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Staff[]>(
        "/api/v1/internal/staff",
        {
          params: {
            page,
            size,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getStaffById: (id: string) => ApiResult<Staff> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewStaff: (staffData: any) => ApiResult<Staff> = async (
    staffData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        "/api/v1/internal/staff",
        {
          method: "POST",
          body: staffData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff) : null;
    } catch (err) {
      throw err
    }
  };

  const updateStaff: (
    staffId: string,
    staffData: any
  ) => ApiResult<Staff> = async (staffId, staffData) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${staffId}`,
        {
          method: "PATCH",
          body: staffData,
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff) : null;
    } catch (err) {
      throw err
    }
  };

  const updateContractPermissions: (
    contractId: string,
    permissionsData: any
  ) => ApiResult<Contract> = async (contractId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${contractId}/permissions`,
        {
          method: "PUT",
          body: permissionsData,
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteStaff: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const activateStaff: (staffId: string) => ApiResult<Staff> = async (
    staffId
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${staffId}/activate-staff`,
        {
          method: "POST",
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff) : null;
    } catch (err) {
      throw err;
    }
  };

  const deactivateStaff: (staffId: string) => ApiResult<Staff> = async (
    staffId
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${staffId}/deactivate-staff`,
        {
          method: "POST",
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff) : null;
    } catch (err) {
      throw err;
    }
  };

  const resetStaffPassword: (staffId: string) => ApiResult<any> = async (
    staffId
  ) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff/${staffId}/reset-password`,
        {
          method: "POST",
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      throw err;
    }
  };

  const unlockUser: (id: string) => ApiResult<Staff> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${id}/unlock`,
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Staff) : null;
    } catch (err) {
      throw err;
    }
  };

  const getStaffDevices: (userId: string) => ApiResult<Device[]> = async (userId) => {
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

  const getStaffDevicesByDeviceId: (userId: string, deviceId: string) => ApiResult<User> = async (userId, deviceId) => {
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

  const suspendStaffDevicesByDeviceId: (userId: string, deviceId: string) => ApiResult<User> = async (userId, deviceId) => {
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

  const restoreStaffDevicesByDeviceId: (userId: string, deviceId: string) => ApiResult<User> = async (userId, deviceId) => {
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

  const getStaffLoginHistory: (
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
    page,
    size,
    sort,
    staffs: data,
    total,
    loading,
    error,
    fetchStaffs: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,

    isLoading,
    getStaffs,
    getStaffById,
    createNewStaff,
    deleteStaff,
    updateStaff,
    updateContractPermissions,
    activateStaff,
    deactivateStaff,
    resetStaffPassword,
    unlockUser,
    getStaffDevices,
    getStaffDevicesByDeviceId,
    suspendStaffDevicesByDeviceId,
    restoreStaffDevicesByDeviceId,
    getStaffLoginHistory,
    isSubmitting,
  };
};
