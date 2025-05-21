import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, Staff, StaffAssignment } from "~/types";
import { useApi } from "./useApi";

export const useStaffAssignments = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getStaffAssignments: (
    page?: number,
    size?: number
  ) => Promise<StaffAssignment[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment[]>(
        '/api/v1/internal/staff-assignments',
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
        throw new Error("No staff assignments data received");
      }

      return data.value as unknown as StaffAssignment[];
    } catch (err) {
      throw err;
    }
  };

  const getStaffAssignmentById: (id: string) => Promise<StaffAssignment> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        `/api/v1/internal/staff-assignments/${id}`
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
        throw new Error("No Staff Assignment with this id received");
      }

      return data.value as unknown as StaffAssignment;
    } catch (err) {
      throw err;
    }
  };

  const getStaffAssignmentByStaffId: (id: string) => Promise<StaffAssignment> = async (staffId) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        `/api/v1/internal/staff-assignments/staff/${staffId}`
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
        throw new Error("No Staff Assignment with this staff id received");
      }

      return data.value as unknown as StaffAssignment;
    } catch (err) {
      throw err;
    }
  };

  const createNewStaffAssignment: (
    staffAssignmentData: any
  ) => Promise<StaffAssignment> = async (staffAssignmentData) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        '/api/v1/internal/staff-assignments/assign',
        {
          method: "POST",
          body: staffAssignmentData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation" 
            ? error.value?.data?.fieldErrors[0]?.message 
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive"
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No staff assignment with this customer id received");
      }

      return data.value as unknown as StaffAssignment;
    } catch (err) {
      throw err;
    }
  };

  const updateStaffAssignment: (
    staffAssignmentId: string,
    staffAssignmentData: any
  ) => Promise<StaffAssignment> = async (staffAssignmentId, staffAssignmentData) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        `/api/v1/internal/staff-assignments/${staffAssignmentId}`,
        {
          method: "PATCH",
          body: staffAssignmentData
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
        throw new Error("No staff assignment with this staff assignment id received");
      }

      return data.value as unknown as StaffAssignment;
    } catch (err) {
      throw err;
    }
  };

  const staffAssign: (
    assignmentData: any
  ) => Promise<StaffAssignment> = async (assignmentData) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        '/api/v1/internal/staff-assignments/assign',
        {
          method: "PUT",
          body: assignmentData
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
        throw new Error("No staff assignment with this contract id received");
      }

      return data.value as unknown as StaffAssignment;
    } catch (err) {
      throw err;
    }
  };

  const deleteStaffAssignment: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff-assignments/${id}`,
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
    getStaffAssignments,
    getStaffAssignmentById,
    createNewStaffAssignment,
    deleteStaffAssignment,
    updateStaffAssignment,
    staffAssign,
    getStaffAssignmentByStaffId,
    isSubmitting,
  };
};
