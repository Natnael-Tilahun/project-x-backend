import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Protocol, IntegrationType, RetryStrategy } from "@/global-types";
const ProtocolSchema = z.nativeEnum(Protocol).optional().nullable();
const IntegrationTypeSchema = z.nativeEnum(IntegrationType);
const RetryStrategySchema = z.nativeEnum(RetryStrategy).optional().nullable();

export const apiIntegrationFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string().min(2),
    url: z.string().min(2),
    type: IntegrationTypeSchema,
    description: z.string().optional().nullable(),
    version: z.string().min(0).max(50).optional().nullable(),
    timeout: z.number().optional().nullable(),
    retryRetries: z.number().optional().nullable(),
    retryDelay: z.number().optional().nullable(),
    apiOperations: z.any().optional().nullable(),
    apiIntegrationPath: z.string().optional().nullable(),
    authConfig: z.any().optional().nullable(),
    protocol: ProtocolSchema,
    host: z.string().optional().nullable(),
    retryStrategy: RetryStrategySchema,
  })
);
