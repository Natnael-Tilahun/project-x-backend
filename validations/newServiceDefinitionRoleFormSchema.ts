import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";


export const newServiceDefinitionRoleFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    isDefault: z.boolean().optional().default(false),
    serviceDefinition: z.any().nullable(),
    role: z.string().nullable(),
  })
);