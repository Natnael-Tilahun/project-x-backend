import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const updateContractFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string().nullable(),
    permissions: z.array(z.any()).optional().nullable(),
    serviceDefinition: z.any(),
  })
);
