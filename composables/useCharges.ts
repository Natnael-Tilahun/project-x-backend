import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Charge, ChargeRule } from "~/types";

export const useCharges = () => {
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getCharges: (page?: number, size?: number) => Promise<Charge[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Charge[]>(
        '/api/v1/internal/charges',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charges error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charges data received");
      }
      return data.value as unknown as Charge[];
    } catch (err) {
      throw err;
    }
  };

  const getChargesCount: () => Promise<number> = async () => {
    try {
      const { data, pending, error, status } = await fetch<number>(
        '/api/v1/internal/charges/count'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charges count error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charges count data received");
      }
      return data.value as unknown as number;
    } catch (err) {
      throw err;
    }
  };

  const getChargeById: (id: string) => Promise<Charge> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Charge>(
        `/api/v1/internal/charges/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charge data error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charge data received");
      }
      return data.value as unknown as Charge;
    } catch (err) {
      throw err;
    }
  };

  const getChargeRulesByChargeId: (id: string) => Promise<ChargeRule[]> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ChargeRule[]>(
        `/api/v1/internal/charges/${id}/rules`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charge rule data error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charge rule data received");
      }
      return data.value as unknown as ChargeRule[];
    } catch (err) {
      throw err;
    }
  };

  const deleteChargeById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/charges/${id}`,
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
        throw new Error("Deleting charge error: " + error.value);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const createNewCharge: (chargeDetail: Charge) => Promise<Charge> = async (chargeDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No charge data received");
      }
      return data.value as unknown as Charge;
    } catch (err) {
      throw err;
    }
  };

  const updateCharge: (chargeId: string, chargeDetail: any) => Promise<Charge> = async (chargeId, chargeDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No charge data received");
      }
      return data.value as unknown as Charge;
    } catch (err) {
      throw err;
    }
  };

  const createNewChargeRule: (chargeId: string, chargeRuleDetail: ChargeRule) => Promise<ChargeRule> = async (chargeId, chargeRuleDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No charge rule data received");
      }
      return data.value as unknown as ChargeRule;
    } catch (err) {
      throw err;
    }
  };

  const getChargeRuleById: (id: number) => Promise<ChargeRule> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<ChargeRule>(
        `/api/v1/internal/charges/rules/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charge rule data error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charge rule data received");
      }
      return data.value as unknown as ChargeRule;
    } catch (err) {
      throw err;
    }
  };

  const updateChargeRule: (ruleId: number, ruleDetail: any) => Promise<ChargeRule> = async (ruleId, ruleDetail) => {
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
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description: error.value?.data?.type == "/constraint-violation"
            ? error.value?.data?.fieldErrors[0]?.message
            : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No rule data received");
      }
      return data.value as unknown as ChargeRule;
    } catch (err) {
      throw err;
    }
  };

  const deleteChargeRuleById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/charges/rules/${id}`,
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
        throw new Error("Deleting charge rule error: " + error.value);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const deleteAllChargeRules: (chargeId: string) => Promise<any> = async (chargeId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/charges/${chargeId}/all-rules`,
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
        throw new Error("Deleting all charge rules error: " + error.value);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const refreshCoreCharges: () => Promise<any> = async () => {
    try {
      const { data, pending, error, status } = await fetch<Charge[]>(
        '/api/v1/internal/charges/refresh-core',
        { method: "POST" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Refreshing charges from core error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charges data received");
      }
      return data.value as unknown as Charge[];
    } catch (err) {
      throw err;
    }
  };

  return {
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
