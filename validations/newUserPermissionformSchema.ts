import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUserPermissionformSchema = toTypedSchema(
  z.object({
    permissionName: z.string().min(5).max(50),
    legalEntity: z.string(),
    description: z.string().min(5).max(200),
  })
);
