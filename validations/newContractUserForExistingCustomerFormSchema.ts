import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractUserForExistingCustomerFormSchema = toTypedSchema(
  z.object({
    email: z.string().optional(),
    language: z.string().optional().nullable(),
    nationalId: z.string().optional().nullable(),
    isPrimaryUser: z.boolean().default(true),
    serviceDefinitionRoleId: z.string(),
    id: z.string().optional().nullable(),
    contractUserAccountDTOSet: z.array(
      z.object({
        inheritAccountPermissions: z
          .boolean()
          .default(true)
          .optional()
          .nullable(),
        permissionCodes: z.array(z.string()).optional().nullable(),
        accountId: z.string().optional().nullable(),
      })
    ).optional(),
  })
);
