import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUserRoleformSchema = toTypedSchema(
  z.object({
    roleName: z.string().min(5).max(50),
    legalEntity: z.string(),
    description: z.string().min(5).max(200),
  })
);
