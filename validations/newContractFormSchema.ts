import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ServiceType } from "@/global-types";
const ServiceTypeSchema = z.nativeEnum(ServiceType).nullable();

export const newContractFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    name: z.string().nullable(),
    serviceType: ServiceTypeSchema,
    permissions: z.array(z.any()).optional().nullable(),
    serviceDefinition: z.any().optional().nullable(),
  })
);