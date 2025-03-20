import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractUserFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    enabled: z.boolean().optional().nullable().default(true),
    isPrimaryUser: z.boolean().optional().nullable().default(false),
    user: z.any().optional().nullable(),
    contract: z.any().optional().nullable(),
    serviceDefinitionRole: z.any(),
  })
);
