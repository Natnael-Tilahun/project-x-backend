import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useContracts = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContracts: (
    page?: number,
    size?: number
  ) => ApiResult<Contract[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        "/api/v1/internal/contracts",
        {
          params: { page, size },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract[]) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  const getContractById: (id: string) => ApiResult<Contract> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  const searchContract: (keyword: string) => ApiResult<Contract[]> = async (
    keyword
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        `/api/v1/internal/contracts/search`,
        {
          params: { keyword },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract[]) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  const getContractByCustomerId: (id: string) => ApiResult<Contract[]> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        `/api/v1/internal/contracts/customer/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract[]) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  const getContractByCoreCustomerId: (
    id: string
  ) => ApiResult<Contract[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        `/api/v1/internal/contracts/coreCustomer/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract[]) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  const createNewContract: (contractData: any) => ApiResult<Contract> = async (
    contractData
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        "/api/v1/internal/contracts",
        {
          method: "POST",
          body: contractData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract) : null;
    } catch (err) {
      // handleApiError(err);
      throw err;
    }
  };

  const updateContract: (
    contractId: string,
    contractData: any
  ) => ApiResult<Contract> = async (contractId, contractData) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${contractId}`,
        {
          method: "PATCH",
          body: contractData,
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Contract) : null;
    } catch (err) {
      // handleApiError(err);
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
      // handleApiError(err);
      return null;
    }
  };

  const deleteContract: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contracts/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  return {
    isLoading,
    getContracts,
    getContractById,
    createNewContract,
    deleteContract,
    updateContract,
    updateContractPermissions,
    getContractByCoreCustomerId,
    getContractByCustomerId,
    searchContract,
    isSubmitting,
  };
};
