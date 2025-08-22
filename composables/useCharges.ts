import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Charge, ChargeRule } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useCharges = () => {
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

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
  } = usePagination<Charge>({endpoint:'/api/v1/internal/charges', sortValue:"chargeCode,asc"});

  const getCharges: (page?: number, size?: number) => ApiResult<Charge[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Charge[]>(
        '/api/v1/internal/charges',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Charge[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getChargesCount: () => ApiResult<number> = async () => {
    try {
      const { data, pending, error, status } = await fetch<number>(
        '/api/v1/internal/charges/count'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as number) : null;
    } catch (err) {
      throw err
    }
  };

  const getChargeById: (id: string) => ApiResult<Charge> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Charge>(
        `/api/v1/internal/charges/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Charge) : null;
    } catch (err) {
      throw err
    }
  };

  const getChargeRulesByChargeId: (id: string) => ApiResult<ChargeRule[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ChargeRule[]>(
        `/api/v1/internal/charges/${id}/rules`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ChargeRule[]) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteChargeById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/charges/${id}`,
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

  const createNewCharge: (chargeDetail: Charge) => ApiResult<Charge> = async (chargeDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Charge>(
        '/api/v1/internal/charges',
        {
          method: "POST",
          body: chargeDetail
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Charge) : null;
    } catch (err) {
      throw err
    }
  };

  const updateCharge: (chargeId: string, chargeDetail: any) => ApiResult<Charge> = async (chargeId, chargeDetail) => {
    try {
      const { data, pending, error, status } = await fetch<Charge>(
        `/api/v1/internal/charges/${chargeId}`,
        {
          method: "PATCH",
          body: chargeDetail
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Charge) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewChargeRule: (chargeId: string, chargeRuleDetail: ChargeRule) => ApiResult<ChargeRule> = async (chargeId, chargeRuleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<ChargeRule>(
        `/api/v1/internal/charges/${chargeId}/rules`,
        {
          method: "POST",
          body: chargeRuleDetail
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ChargeRule) : null;
    } catch (err) {
      throw err
    }
  };

  const getChargeRuleById: (id: number) => ApiResult<ChargeRule> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ChargeRule>(
        `/api/v1/internal/charges/rules/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ChargeRule) : null;
    } catch (err) {
      throw err
    }
  };

  const updateChargeRule: (ruleId: number, ruleDetail: any) => ApiResult<ChargeRule> = async (ruleId, ruleDetail) => {
    try {
      const { data, pending, error, status } = await fetch<ChargeRule>(
        `/api/v1/internal/charges/rules/${ruleId}`,
        {
          method: "PUT",
          body: ruleDetail
        }
      );

      isUpdating.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as ChargeRule) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteChargeRuleById: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/charges/rules/${id}`,
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

  const deleteAllChargeRules: (chargeId: string) => ApiResult<any> = async (chargeId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/charges/${chargeId}/all-rules`,
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

  const refreshCoreCharges: () => ApiResult<Charge[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Charge[]>(
        '/api/v1/internal/charges/refresh-core',
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Charge[]) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    // Server pagination API
    page,
    size,
    sort,
    offices: data,
    total,
    loading,
    error,
    fetchOffices: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,

    isLoading,
    isUpdating,
    getCharges,
    getChargesCount,
    getChargeRulesByChargeId,
    getChargeById,
    deleteChargeById,
    createNewCharge,
    updateCharge,
    createNewChargeRule,
    getChargeRuleById,
    updateChargeRule,
    deleteChargeRuleById,
    deleteAllChargeRules,
    refreshCoreCharges,
  };
};
