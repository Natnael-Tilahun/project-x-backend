import type { ApiError, ApiResponse } from "~/types";
import { useToast } from "~/components/ui/toast";

export type ApiResult<T> = Promise<T | null>;
const { toast } = useToast();

export const handleApiError = (error: any): never => {
    const errorData = error?.value?.data as ApiError;
    console.log("errorData: ", errorData.type)
    toast({
      title: errorData?.type || "Something went wrong!",
      description: errorData?.type === "/constraint-violation"
        ? errorData?.fieldErrors?.[0]?.message
        : errorData?.message || errorData?.detail,
      variant: "destructive",
    });
  const errorMessage = errorData.detail || 
    errorData.message || 
    errorData.fieldErrors?.[0]?.message || 
    'An unexpected error occurred';

    if(errorData?.type == "TFA_INVALID_TOKEN" || errorData?.type == "TFA_TOKEN_NOT_FOUND" ){
        navigateTo("/invalid-2fa")
    }
  
  throw new Error(errorMessage);
}; 