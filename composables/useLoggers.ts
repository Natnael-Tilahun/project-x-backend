import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Charge, ChargeRule } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useLoggers = () => {
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getLoggers: () => ApiResult<any[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/loggers'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getHealth: () => ApiResult<any[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/health'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getConfigprops: () => ApiResult<any[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/configprops',
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getThreaddump: (page?: number, size?: number) => ApiResult<any[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/threaddump',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };
  
 const getEnv: () => ApiResult<any[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/env'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getPrometheus: (page?: number, size?: number) => ApiResult<any[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/prometheus',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getJhimetrics: (page?: number, size?: number) => ApiResult<any[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<any[]>(
        '/management/jhimetrics',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as any[]) : null;
    } catch (err) {
      throw err
    }
  };

  const updateLoggerLevel = async (name: string, configuredLevel: string) => {
    try {
      await fetch(`/management/loggers/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configuredLevel }),
      });
    } catch (err) {
      handleApiError(err);
    }
  };
  
  return {
    isLoading,
    isUpdating,
    getLoggers,
    getHealth,
    getConfigprops,
    getThreaddump,
    getEnv,
    getPrometheus,
    getJhimetrics,
    updateLoggerLevel
  };
};
