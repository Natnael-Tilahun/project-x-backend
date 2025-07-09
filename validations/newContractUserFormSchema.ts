import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newContractUserFormSchema = toTypedSchema(
  z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string(),
    language: z.string().optional(),
    nationalId: z.string().optional().nullable(),
    isPrimaryUser: z.boolean().default(true),
    serviceDefinitionRoleId: z.string(),
    coreAccountNumber: z.string(),
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
