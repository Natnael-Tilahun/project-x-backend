import { useApi } from "./useApi";
import type { Office } from "~/types";
import { handleApiError } from "~/types/api";

export const useOffice = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getOffices: (page?: number, size?: number) => Promise<Office[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Office[]>(
        '/api/v1/internal/offices',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error)
      }

      if (!data.value) {
        throw new Error("No office data received");
      }

      return data.value as unknown as Office[];
    } catch (err) {
      throw err;
    }
  };

  const getOfficeById: (id: string) => Promise<Office> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Office>(
        `/api/v1/internal/offices/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error)
      }

      if (!data.value) {
        throw new Error("No Office with this id received");
      }

      return data.value as unknown as Office;
    } catch (err) {
      throw err;
    }
  };

  const createNewOffice: (staffData: any) => Promise<Office> = async (staffData) => {
    try {
      const { data, pending, error, status } = await fetch<Office>(
        '/api/v1/internal/offices',
        {
          method: "POST",
          body: staffData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error)
      }

      if (!data.value) {
        throw new Error("No Office with this Office id received");
      }

      return data.value as unknown as Office;
    } catch (err) {
      throw err;
    }
  };

  const updateOffice: (staffId: string, staffData: any) => Promise<Office> = async (staffId, staffData) => {
    try {
      const { data, pending, error, status } = await fetch<Office>(
        `/api/v1/internal/offices/${staffId}`,
        {
          method: "PATCH",
          body: staffData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error)
      }

      if (!data.value) {
        throw new Error("No Office with this Office id received");
      }

      return data.value as unknown as Office;
    } catch (err) {
      throw err;
    }
  };

  const deleteOffice: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/offices/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error)
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  return {
    isLoading,
    getOffices,
    getOfficeById,
    createNewOffice,
    deleteOffice,
    updateOffice,
    isSubmitting,
  };
};
