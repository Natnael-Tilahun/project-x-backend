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
        : errorData?.detail || errorData?.message,
      variant: "destructive",
    });
  const errorMessage = errorData.detail || 
    errorData.message || 
    errorData.fieldErrors?.[0]?.message || 
    'An unexpected error occurred';

    if(errorData?.type == "TFA_INVALID_TOKEN" || errorData?.type == "TFA_TOKEN_NOT_FOUND" ){
        navigateTo("/invalid-2fa")
    }

    if(errorData?.detail	 == "Access Denied" ){
      console.log("error deatil: ", errorData.detail)
      navigateTo("/unauthorized")
  }
  
  throw new Error(errorMessage);
}; 