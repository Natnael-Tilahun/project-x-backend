import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractCoreCustomerFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    coreCustomerStatus: z.boolean().optional().nullable(),
    coreCustomerId: z.string(),
    contract: z.any(),
    permissions: z.array(z.any()).optional().nullable(),
  })
);