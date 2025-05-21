import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Contract } from "~/types";

export const useContracts = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getContracts: (page?: number, size?: number) => Promise<Contract[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        '/api/v1/internal/contracts',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contracts data received");
      }

      return data.value as unknown as Contract[];
    } catch (err) {
      throw err;
    }
  };

  const getContractById: (id: string) => Promise<Contract> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract with this id received");
      }

      return data.value as unknown as Contract;
    } catch (err) {
      throw err;
    }
  };

  const getContractByCustomerId: (id: string) => Promise<Contract[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        `/api/v1/internal/contracts/customer/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract with this customer id received");
      }

      return data.value as unknown as Contract[];
    } catch (err) {
      throw err;
    }
  };

  const getContractByCoreCustomerId: (id: string) => Promise<Contract[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Contract[]>(
        `/api/v1/internal/contracts/coreCustomer/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract with this coreCustomer id received");
      }

      return data.value as unknown as Contract[];
    } catch (err) {
      throw err;
    }
  };

  const createNewContract: (contractData: any) => Promise<Contract> = async (contractData) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        '/api/v1/internal/contracts',
        {
          method: "POST",
          body: contractData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message || error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No contract with this customer id received");
      }

      return data.value as unknown as Contract;
    } catch (err) {
      throw err;
    }
  };

  const updateContract: (contractId: string, contractData: any) => Promise<Contract> = async (contractId, contractData) => {
    try {
      const { data, pending, error, status } = await fetch<Contract>(
        `/api/v1/internal/contracts/${contractId}`,
        {
          method: "PATCH",
          body: contractData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
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

  const updateContractPermissions: (contractId: string, permissionsData: any) => Promise<Contract> = async (contractId, permissionsData) => {
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
          variant: "destructive",
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

  const deleteContract: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/contracts/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.message,
          variant: "destructive",
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
    getContracts,
    getContractById,
    createNewContract,
    deleteContract,
    updateContract,
    updateContractPermissions,
    getContractByCoreCustomerId,
    getContractByCustomerId,
    isSubmitting,
  };
};
