import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, Staff } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useStaffs = () => {
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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
      handleApiError(err);
      return null;
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

  return {
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
    isSubmitting,
  };
};
