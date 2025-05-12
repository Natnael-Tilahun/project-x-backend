import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { Charge, ChargeRule } from "~/types";

export const useCharges = () => {
  const runtimeConfig = useRuntimeConfig();
  const authUser = useAuthUser();
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { getRefreshToken } = useAuth();

  const store = useAuthStore();
  const { toast } = useToast();

  const getCharges: (
    page?: number,
    size?: number
  ) => Promise<Charge[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await useFetch<Charge[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charges error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charges data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getChargesCount: () => Promise<number> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<number>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/count`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charges count error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charges count data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getChargeById: (id: string) => Promise<Charge> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<Charge>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charge data error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charge data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getChargeRulesByChargeId: (id: string) => Promise<ChargeRule[]> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ChargeRule[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/${id}/rules`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charge rule data error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charge rule data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteChargeById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting charge error: ", error.value?.data?.message);
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error("Deleting charge error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewCharge: (chargeDetail: Charge) => Promise<Charge> = async (
    chargeDetail
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<Charge>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(chargeDetail),
        }
      );
      isLoading.value = pending.value;
      if (status.value === "error") {
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new charge error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log("Creating new charge error: ", error.value?.data?.detail);
        }
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No charge data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateCharge: (
    chargeId: string,
    chargeDetail: any
  ) => Promise<Charge> = async (chargeId, chargeDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<Charge>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/${chargeId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(chargeDetail),
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating charge error: ", error.value?.data?.detail);
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No charge data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const createNewChargeRule: (
    chargeId: string,
    chargeRuleDetail: ChargeRule
  ) => Promise<ChargeRule> = async (chargeId, chargeRuleDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<ChargeRule>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/${chargeId}/rules`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(chargeRuleDetail),
        }
      );
      isLoading.value = pending.value;
      if (status.value === "error") {
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });

        if (error.value?.data?.type == "/constraint-violation") {
          console.log(
            "Creating new charge rule error: ",
            error.value?.data?.fieldErrors[0].message
          );
        } else {
          console.log(
            "Creating new charge rule error: ",
            error.value?.data?.detail
          );
        }
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No charge rule data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const getChargeRuleById: (id: number) => Promise<ChargeRule> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<ChargeRule>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/rules/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Getting charge rule data error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charge rule data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const updateChargeRule: (
    ruleId: number,
    ruleDetail: any
  ) => Promise<ChargeRule> = async (ruleId, ruleDetail) => {
    try {
      const { data, pending, error, status } = await useFetch<ChargeRule>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/rules/${ruleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
          body: JSON.stringify(ruleDetail),
        }
      );
      isUpdating.value = pending.value;
      if (status.value === "error") {
        console.log("Updating rule error: ", error.value?.data?.detail);
        toast({
          title: error.value?.data?.title || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.detail,
          variant: "destructive",
        });
        throw new Error(error.value?.data?.detail);
      }
      if (!data.value) {
        throw new Error("No rule data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteChargeRuleById: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/rules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log("Deleting charge rule error: ", error.value?.data?.message);
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error("Deleting charge rule error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const deleteAllChargeRules: (chargeId: string) => Promise<any> = async (
    chargeId
  ) => {
    try {
      const { data, pending, error, status } = await useFetch<any>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/${chargeId}/all-rules/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        console.log(
          "Deleting all charge rules error: ",
          error.value?.data?.message
        );
        toast({
          title: error.value?.data?.type || "Something went wrong!",
          description:
            error.value?.data?.type == "/constraint-violation"
              ? error.value?.data?.fieldErrors[0]?.message
              : error.value?.data?.message,
          variant: "destructive",
        });
        throw new Error("Deleting all charge rules error: " + error.value);
      }

      return data;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
      throw err;
    }
  };

  const refreshCoreCharges: () => Promise<any> = async () => {
    try {
      const { data, pending, error, status } = await useFetch<Charge[]>(
        `${runtimeConfig.public.API_BASE_URL}/api/v1/internal/charges/refresh-core`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.accessToken}`,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error("Refreshing charges from core error: " + error.value);
      }
      if (!data.value) {
        throw new Error("No charges data received");
      }
      return data.value;
    } catch (err) {
      // Throw the error to be caught and handled by the caller
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
