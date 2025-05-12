import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Contract, Staff, StaffAssignment } from "~/types";

export const useStaffAssignments = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);

  const store = useAuthStore();

  const getStaffAssignments: (
    page?: number,
    size?: number
  ) => Promise<StaffAssignment[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<StaffAssignment[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments?page=${page}&size=${size}`,
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
        throw new Error("No staff assignments data received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getStaffAssignmentById: (id: string) => Promise<StaffAssignment> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<StaffAssignment>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments/${id}`,
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
        throw new Error("No Staff Assignment with this id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getStaffAssignmentByStaffId: (id: string) => Promise<StaffAssignment> = async (staffId) => {
    try {
      const { data, pending, error, status } = await useFetch<StaffAssignment>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments/staff/${staffId}`,
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
        throw new Error("No Staff Assignment with this staff id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewStaffAssignment: (
    staffAssignmentData: any
  ) => Promise<StaffAssignment> = async (staffAssignmentData) => {
    try {
      const { data, pending, error, status } = await useFetch<StaffAssignment>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(staffAssignmentData),
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });

        console.log("Creating new staff assignment error: ", error.value?.data.detail);

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new staff assignment error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new staff assignment errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data.detail);
      }

      if (!data.value) {
        throw new Error("No staff assignment with this customer id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateStaffAssignment: (
    staffAssignmentId: string,
    staffAssignmentData: any
  ) => Promise<StaffAssignment> = async (staffAssignmentId, staffAssignmentData) => {
    try {
      const { data, pending, error, status } = await useFetch<StaffAssignment>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments/${staffAssignmentId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(staffAssignmentData),
        }
      );

      isSubmitting.value = pending.value;

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
            "Updating staff assignment error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating staff assignment errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No staff assignment with this staff assignment id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const staffAssign: (
    assignmentData: any
  ) => Promise<StaffAssignment> = async (assignmentData) => {
    try {
      const { data, pending, error, status } = await useFetch<StaffAssignment>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments/assign`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(assignmentData),
        }
      );

      isSubmitting.value = pending.value;

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
            "Updating staff assignment error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Updating staff assignment errorrr: ",
            error.value?.data?.message
          );
        }
        throw new Error(error.value?.data);
      }

      if (!data.value) {
        throw new Error("No staff assignment with this contract id received");
      }

      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteStaffAssignment: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/staff-assignments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting staff assignment error: ", error.value?.data?.message);
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
