import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, Staff } from "~/types";
import { useApi } from "./useApi";

export const useStaffs = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getStaffs: (
    page?: number,
    size?: number
  ) => Promise<Staff[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Staff[]>(
        '/api/v1/internal/staff',
        {
          params: {
            page,
            size
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
        throw new Error("No staff data received");
      }

      return data.value as unknown as Staff[];
    } catch (err) {
      throw err;
    }
  };

  const getStaffById: (id: string) => Promise<Staff> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${id}`
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
        throw new Error("No Staff with this id received");
      }

      return data.value as unknown as Staff;
    } catch (err) {
      throw err;
    }
  };

  const createNewStaff: (
    staffData: any
  ) => Promise<Staff> = async (staffData) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        '/api/v1/internal/staff',
        {
          method: "POST",
          body: staffData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.detail || error.value?.data?.message,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No staff with this customer id received");
      }

      return data.value as unknown as Staff;
    } catch (err) {
      throw err;
    }
  };

  const updateStaff: (
    staffId: string,
    staffData: any
  ) => Promise<Staff> = async (staffId, staffData) => {
    try {
      const { data, pending, error, status } = await fetch<Staff>(
        `/api/v1/internal/staff/${staffId}`,
        {
          method: "PATCH",
          body: staffData
        }
      );

      isSubmitting.value = pending.value;

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
        throw new Error("No staff with this staff id received");
      }

      return data.value as unknown as Staff;
    } catch (err) {
      throw err;
    }
  };

  const updateContractPermissions: (
    contractId: string,
    permissionsData: any
  ) => Promise<Contract> = async (contractId, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${contractId}/permissions`,
        {
          method: "PUT",
          body: permissionsData
        }
      );

      isSubmitting.value = pending.value;

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
        throw new Error("No contract with this contract id received");
      }

      return data.value as unknown as Contract;
    } catch (err) {
      throw err;
    }
  };

  const deleteStaff: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff/${id}`,
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

  return {
    isLoading,
    getStaffs,
    getStaffById,
    createNewStaff,
    deleteStaff,
    updateStaff,
    updateContractPermissions,
    isSubmitting,
  };
};
