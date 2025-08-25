import { useApi } from "./useApi";

export const useTempleteProcessor = () => {
  const isLoading = ref<boolean>(false);
  const { fetch } = useApi();

  const extractTemplateVariables = async (template: string): Promise<string[]> => {
    isLoading.value = true;
    try {
      const { data, error } = await fetch<{ variables: string[] }>(
        '/api/v1/internal/template/extract',
        {
          method: "POST",
          body: { template },
        }
      );

      if (error.value) {
        throw error.value;
      }
      
      return data.value?.variables || [];
    } catch (error) {
      console.error("Error extracting template variables:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const processTemplate = async (template: string, variables: Record<string, string>): Promise<string> => {
    isLoading.value = true;
    try {
      const { data, error } = await fetch<{ processedTemplate: string }>(
        '/api/v1/internal/template/process',
        {
          method: "POST",
          body: { template, variables },
        }
      );

      if (error.value) {
        throw error.value;
      }

      return data.value?.processedTemplate || "";
    } catch (error) {
      console.error("Error processing template:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    extractTemplateVariables,
    processTemplate,
  };
};
