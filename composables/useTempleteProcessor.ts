import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useTempleteProcessor = (applicationId?: Ref<string>) => {
  const isLoading = ref<boolean>(false);
  const isUpdating = ref<boolean>(false);
  const { fetch } = useApi();


  const extractTemplateVariables: (template: string) => ApiResult<{ variables: string[] }> = async (template) => {
    try {
      const { data, pending, error, status } = await fetch<{ variables: string[] }>(
        '/api/v1/internal/template/extract',
        {
          
          method: "POST",
          body: {template}
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value?.variables as unknown as { variables: string[] }) : null;
    } catch (err) {
      throw err
    }
  };


  const processTemplate: (template: string,  variables: Record<string, string>) => ApiResult<{ processedTemplate: string }> = async (template, variables) => {
    try {
      const { data, pending, error, status } = await fetch<{ processedTemplate: string }>(
        '/api/v1/internal/template/process',
        {
          method: "POST",
          body: { template, variables },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value?.processedTemplate as unknown as { processedTemplate: string }) : null;
    } catch (err) {
      throw err
    }
  };



  return {
    isLoading,
    isUpdating,
    extractTemplateVariables,
    processTemplate
  };
};
