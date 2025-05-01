import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractUserFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    serviceDefinitionRoleId: z.string(),
    enable: z.boolean().optional().nullable().default(true),
    isPrimaryUser: z.boolean(),
    // user: z.any().optional().nullable(),
    // contract: z.any().optional().nullable(),
  })
);
