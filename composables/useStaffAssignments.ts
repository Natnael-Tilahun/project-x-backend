import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, Staff, StaffAssignment } from "~/types";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useStaffAssignments = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getStaffAssignments: (
    page?: number,
    size?: number
  ) => ApiResult<StaffAssignment[]> = async (page, size) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as StaffAssignment[]) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getStaffAssignmentById: (id: string) => ApiResult<StaffAssignment> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        `/api/v1/internal/staff-assignments/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as StaffAssignment) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const getStaffAssignmentByStaffId: (id: string) => ApiResult<StaffAssignment> = async (staffId) => {
    try {
      const { data, pending, error, status } = await fetch<StaffAssignment>(
        `/api/v1/internal/staff-assignments/staff/${staffId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as StaffAssignment) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const createNewStaffAssignment: (
    staffAssignmentData: any
  ) => ApiResult<StaffAssignment> = async (staffAssignmentData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as StaffAssignment) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const updateStaffAssignment: (
    staffAssignmentId: string,
    staffAssignmentData: any
  ) => ApiResult<StaffAssignment> = async (staffAssignmentId, staffAssignmentData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as StaffAssignment) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const staffAssign: (
    assignmentData: any
  ) => ApiResult<StaffAssignment> = async (assignmentData) => {
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
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as StaffAssignment) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const terminateStaffAssignment: (
    staffId:string,
    assignmentData?: any
  ) => ApiResult<StaffAssignment> = async (staffId,assignmentData) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff-assignments/staff/${staffId}/terminate-staff-assignment`,
        {
          method: "POST",
          body: {
            terminationDate: new Date().toISOString()
          }
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const terminateAssignmentsFromStaffs: (
    id:string,
    assignmentData?: any
  ) => ApiResult<StaffAssignment> = async (id,assignmentData) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff-assignments/${id}/terminate-staff-assignment`,
        {
          method: "POST",
          body: {
            terminationDate: new Date().toISOString()
          }
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any) : null;
    } catch (err) {
      handleApiError(err);
      return null;
    }
  };

  const deleteStaffAssignment: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/staff-assignments/${id}`,
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

  return {
    isLoading,
    getStaffAssignments,
    getStaffAssignmentById,
    createNewStaffAssignment,
    deleteStaffAssignment,
    updateStaffAssignment,
    staffAssign,
    terminateStaffAssignment,
    terminateAssignmentsFromStaffs,
    getStaffAssignmentByStaffId,
    isSubmitting,
  };
};
