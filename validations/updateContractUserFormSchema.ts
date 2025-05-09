import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const updateContractUserFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    serviceDefinitionRole: z.string(),
    enable: z.boolean().optional().nullable().default(true),
    isPrimaryUser: z.boolean().default(false),
    user: z.any().optional().nullable(),
    customer: z.any().optional().nullable(),
    contract: z.any().optional().nullable(),
  })
);
