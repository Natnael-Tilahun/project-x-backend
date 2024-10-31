import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const apiOperationFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    operationName: z.string(),
    httpMethod: z.nativeEnum(['GET', 'POST', 'PUT', 'DELETE']),
    endpointPath: z.string(),
    requestBodyTemplate: z.string().optional().nullable(),
    // responseOutputs: z.string().optional().nullable(),
    // requestInputs: z.string().optional().nullable(),
    integrationOperations: z.string().optional().nullable(),
    apiIntegration: z.any().optional().nullable(),
  })
);
