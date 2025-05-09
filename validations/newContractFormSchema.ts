import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string().nullable(),
    permissionCodes: z.array(z.string()).optional().nullable(),
    serviceDefinition: z.string().nullable(),
    inheritParentServicePermissions: z
      .boolean()
      .default(true)
      .optional()
      .nullable(),
    coreCustomers: z.array(
      z.object({
        coreCustomerId: z.string().optional().nullable(),
        inheritParentContractPermissions: z
          .boolean()
          .default(true)
          .optional()
          .nullable(),
        permissionCodes: z.array(z.string()),
        primaryCoreCustomer: z.boolean().default(false).optional().nullable(),
        coreAccounts: z.array(
          z.object({
            inheritContractCustomerPermissions: z
              .boolean()
              .default(true)
              .optional()
              .nullable(),
            permissionCodes: z.array(z.string()).optional().nullable(),
            accountNumber: z.string().optional().nullable(),
          })
        ),
      })
    ),
  })
);
