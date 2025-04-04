import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ServiceDefinitionStatus, ServiceType } from "@/global-types";

const ServiceTypeSchema = z.nativeEnum(ServiceType);
const ServiceDefinitionStatusSchema = z.nativeEnum(ServiceDefinitionStatus).optional().nullable().default(ServiceDefinitionStatus.ACTIVE);

export const newServiceDefinitionFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string(),
    serviceType: ServiceTypeSchema,
    permissions: z.array(z.any()).optional().nullable(),
    description: z.any().optional().nullable(),
    defaultGroup: z.string().optional().nullable(),
    numberOfFeatures: z.number().optional().nullable(),
    numberOfActiveRoles: z.number().optional().nullable(),
    numberOfRoles: z.number().optional().nullable(),
    numberOfContracts: z.number().optional().nullable(),
    status: ServiceDefinitionStatusSchema,
    service: z.any().nullable(),
  })
);