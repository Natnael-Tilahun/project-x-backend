import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ServiceType } from "@/global-types";
const ServiceTypeSchema = z.nativeEnum(ServiceType);

export const newBankingServiceFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    serviceName: z.string(),
    serviceType: ServiceTypeSchema,
    permissions: z.array(z.any()).optional().nullable(),
    description: z.any().optional().nullable(),
  })
);