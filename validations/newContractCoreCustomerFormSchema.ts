import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractCoreCustomerFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    coreCustomerStatus: z.boolean().optional().nullable(),
    primaryCoreCustomer: z.boolean().optional().nullable().default(true),
    inheritParentContractPermissions: z.boolean().optional().nullable().default(false),
    coreCustomerId: z.string(),
    contract: z.any().optional().nullable(),
    permissionCodes: z.array(z.string()).optional().nullable(),
    coreAccounts: z.array(z.string()).optional().nullable(),
  })
);