import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useDocuments = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getDocuments: (page?: number, size?: number) => ApiResult<Document[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Document[]>(
        '/api/v1/internal/documents',
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Document[]) : null;
    } catch (err) {
      throw err
    }
  };

  const getFile: (iconPath: string, entityType: string) => ApiResult<File> = async (iconPath, entityType) => {
    try {
      const { data, pending, error, status } = await fetch<File>(
        `/api/v1/internal/images/${entityType}/${iconPath}`,
        {
          params: {
            maxWidth: 200,
            maxHeight: 200,
            output: 'octet'
          }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
      console.log("error getting files: ", error)
        // handleApiError(error);
      }

      return data.value ? (data.value as unknown as File) : null;
    } catch (err) {
      // throw err
      console.log("error getting files: ", err)
    }
  };

  const getDocumentById: (id: string) => ApiResult<Document> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Document>(
        `/api/v1/internal/documents/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Document) : null;
    } catch (err) {
      throw err
    }
  };

  const createNewDocument: (documentData: any) => ApiResult<Document> = async (documentData) => {
    try {
      const { data, pending, error, status } = await fetch<Document>(
        '/api/v1/internal/documents',
        {
          method: "POST",
          body: documentData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Document) : null;
    } catch (err) {
      throw err
    }
  };

  const uploadFile = async (fileData: any, entityId: string, entityType: string) => {
    try {
      const formData = new FormData();
      formData.append("file", fileData);

      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/images/${entityType}/${entityId}`,
        {
          method: "POST",
          body: formData
        }
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

  const updateDocument: (documentId: string, documentData: any) => ApiResult<Document> = async (documentId, documentData) => {
    try {
      const { data, pending, error, status } = await fetch<Document>(
        `/api/v1/internal/documents/${documentId}`,
        {
          method: "PATCH",
          body: documentData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Document) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteDocument: (id: string) => ApiResult<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/documents/${id}`,
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

  return {
    isLoading,
    getDocuments,
    getDocumentById,
    createNewDocument,
    deleteDocument,
    updateDocument,
    getFile,
    uploadFile,
    isSubmitting,
  };
};
