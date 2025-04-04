import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractCoreCustomerAccountFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    accountNumber: z.string().optional().nullable(),
    enable: z.boolean().default(true),
    coreCustomer: z.any().optional().nullable(),
    contract: z.any().optional().nullable(),
    permissions: z.array(z.any()).optional().nullable(),
  })
);