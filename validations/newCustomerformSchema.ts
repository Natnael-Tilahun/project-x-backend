import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newCustomerformSchema = toTypedSchema(
  z.object({
    // firstName: z.string().min(3).max(15),
    // middleName: z.string().min(3).max(15),
    // lastName: z.string().min(3).max(15),
    // salutation: z.string().optional(),
    // gender: z.string(),
    // addressLine1: z.string(),
    // addressLine2: z.string().optional(),
    // city: z.string(),
    // country: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    nationalId: z.number().optional(),
    // coreCustomerId: z.string(),
    // legacyCustomerId: z.string().optional(),
    // langKey: z.string().optional(),
    // imageUrl: z.any().optional(),
    // olbAllowed: z.boolean().default(false).optional(),
    // staffMember: z.boolean().default(false).optional(),
    // vipcustomer: z.boolean().default(false).optional(),

    id: z.string().optional().nullable(),
    // name: z.string().nullable(),
    permissionCodes: z.array(z.string()).optional().nullable(),
    serviceDefinitionId: z.string().nullable(),
    withPrimaryContractUser: z.boolean().default(true),
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
