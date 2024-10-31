import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const apiIntegrationFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string(),
    url: z.string(),
    type: z.nativeEnum(['JSON', 'SOAP', 'XML', 'NONE']),
    auth: z.nativeEnum(['NONE', 'BASIC', 'BEARER', 'OAUTH']),
    description: z.string().optional().nullable(),
    version: z.string().min(0).max(50),
    timeout: z.number().optional().nullable(),
    retryRetries: z.number().optional().nullable(),
    retryDelay: z.number().optional().nullable(),
    apiOperations: z.array(z.any()).optional(),
  })
);
