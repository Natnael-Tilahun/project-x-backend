import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract, Permission } from "~/types";
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
      throw err
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
      throw err
    }
  };

  const searchContract: (keyword: string) => ApiResult<Contract> = async (
    keyword
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/search`,
        {
          params: { keyword },
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
      throw err
    }
  };

  const getContractByCoreCustomerId: (
    id: string
  ) => ApiResult<Contract[]> = async (id) => {
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
      throw err
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
      throw err
    }
  };

  const refreshContractCoreCustomers: (
    contractId: string
  ) => ApiResult<Contract> = async (contractId) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${contractId}/refresh-core-customers`,
        {
          method: "PATCH",
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

  const getContractPermissions: (
    id: string
  ) => ApiResult<Permission[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contracts/${id}/permissions`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const createContractPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contracts/${id}/permissions`,
        {
          method: "POST",
          body: permissionsData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteContractPermission: (
    id: string,
    permissionsData: any
  ) => ApiResult<Permission[]> = async (id, permissionsData) => {
    try {
      const { data, pending, error, status } = await fetch<Permission[]>(
        `/api/v1/internal/contracts/${id}/permissions`,
        {
          method: "DELETE",
          body: permissionsData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Permission[]) : null;
    } catch (err) {
      throw err;
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
    refreshContractCoreCustomers,
    getContractPermissions,
    createContractPermission,
    deleteContractPermission,
    isSubmitting,
  };
};
