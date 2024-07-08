import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUserRoleformSchema = toTypedSchema(
  z.object({
    name: z.string().min(4).max(50),
    disabled: z.boolean().default(false).optional(),
    enforce2fa: z.boolean().default(false).optional(),
    description: z.string().min(4).max(200),
    // permission: z.array(z.string()).optional()
  })
);
