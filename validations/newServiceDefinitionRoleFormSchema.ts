import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";


export const newServiceDefinitionRoleFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    roleName: z.string(),
    roleDescription: z.string().optional().nullable(),
    isDefault: z.boolean().optional().default(false),
    serviceDefinitionId: z.string().optional().nullable(),
    permissions: z.any().optional().nullable(),
  })
);