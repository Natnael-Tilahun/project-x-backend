import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { PhoneUtil } from "~/lib/phoneUtil";

export const newContractFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string().nullable(),
    phone: z
    .string()
    .refine(PhoneUtil.isPhoneNumber, {
      message: "Enter a valid Ethiopian phone number",
    }),
    permissionCodes: z.array(z.string()).optional().nullable(),
    serviceDefinitionId: z.string(),
    serviceDefinitionRoleId: z.string({message: "This field is required. Please, First select a service definition"}),
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
