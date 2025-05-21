import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import { useApi } from "./useApi";
import type { Document } from "~/types";

export const useDocuments = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();
  const { toast } = useToast();

  const getDocuments: (page?: number, size?: number) => Promise<Document[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Document[]>(
        '/api/v1/internal/documents',
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
        throw new Error("No documents data received");
      }

      return data.value as unknown as Document[];
    } catch (err) {
      throw err;
    }
  };

  const getFile: (iconPath: string, entityType: string) => Promise<File> = async (iconPath, entityType) => {
    try {
      const { data, pending, error, status } = await fetch<File>(
        `/api/v1/internal/images/${entityType}/${iconPath}`,
        {
          params: {
            maxWidth: 200,
            maxHeight: 200,
            output: 'octet'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        throw new Error(error.value?.data?.detail);
      }

      if (!data.value) {
        throw new Error("No file received");
      }

      return data.value as unknown as File;
    } catch (err) {
      throw err;
    }
  };

  const getDocumentById: (id: string) => Promise<Document> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<Document>(
        `/api/v1/internal/documents/${id}`
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
        throw new Error("No document with this id received");
      }

      return data.value as unknown as Document;
    } catch (err) {
      throw err;
    }
  };

  const createNewDocument: (documentData: any) => Promise<Document> = async (documentData) => {
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
        throw new Error("No document received");
      }

      return data.value as unknown as Document;
    } catch (err) {
      throw err;
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
          headers: {
            accept: "application/json"
          },
          body: formData,
          redirect: "follow"
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
        throw new Error("No file received");
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };

  const updateDocument: (documentId: string, documentData: any) => Promise<Document> = async (documentId, documentData) => {
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
        throw new Error("No document with this document id received");
      }

      return data.value as unknown as Document;
    } catch (err) {
      throw err;
    }
  };

  const deleteDocument: (id: string) => Promise<any> = async (id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/internal/documents/${id}`,
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
