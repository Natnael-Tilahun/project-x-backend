import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newCustomerRoleformSchema = toTypedSchema(
  z.object({
    customerRoleName: z.string().min(5).max(50),
    rollType: z.string(),
    discription: z.string().min(5).max(200),
    active: z.boolean().optional(),
  })
);
