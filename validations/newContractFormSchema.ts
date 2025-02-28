import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ServiceType } from "@/global-types";
const ServiceTypeSchema = z.nativeEnum(ServiceType).optional().nullable();

export const newContractFormSchema = toTypedSchema(
  z.object({
    name: z.string(),
    serviceType: ServiceTypeSchema,
    permissions: z.array(z.any()).optional().nullable(),
    serviceDefinition: z.any().optional().nullable(),
  })
);