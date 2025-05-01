import { toTypedSchema } from "@vee-validate/zod";
import type { Phone } from "lucide-vue-next";
import { z } from "zod";

export const newContractUserAndCustomerFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    isPrimaryUser: z.boolean().optional().nullable().default(true),
    phone: z.string(),
    language: z.string().optional(),
    nationalId: z.number().optional(),
    serviceDefinitionRoleId: z.string(),
  })
);
