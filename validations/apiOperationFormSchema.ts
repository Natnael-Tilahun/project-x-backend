import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { BodyType, HttpMethod } from "@/global-types";


const bodyTypeSchema = z.nativeEnum(BodyType).optional().nullable();
const httpMethodSchema = z.nativeEnum(HttpMethod);
export const apiOperationFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    operationName: z.string(),
    httpMethod: httpMethodSchema,
    endpointPath: z.string(),
    requestBodyTemplate: z.string().optional().nullable(),
    // responseOutputs: z.string().optional().nullable(),
    // requestInputs: z.string().optional().nullable(),
    integrationOperations: z.string().optional().nullable(),
    apiIntegration: z.any().optional().nullable(),
    bodyType: bodyTypeSchema,
    apiOperationPath: z.string().optional().nullable(),
  })
);
