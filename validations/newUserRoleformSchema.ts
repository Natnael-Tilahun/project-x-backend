import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUserRoleformSchema = toTypedSchema(
  z.object({
    name: z.string()
      .min(4)
      .max(50)
      .regex(/^[A-Za-z0-9_]+$/, "Name must only contain letters, numbers, and underscores"),
    enabled: z.boolean().default(false).optional(),
    enforce2fa: z.boolean().default(false).optional(),
    effectiveToAllBranch: z.boolean().default(false).optional(),
    description: z.string().min(4).max(200),
    scope: z.string(),
    // permission: z.array(z.string()).optional()
  })
);
