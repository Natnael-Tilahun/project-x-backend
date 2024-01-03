import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const profileFormSchema = toTypedSchema(
  z.object({
    employeeId: z.string().min(5).max(50),
    firstName: z.string().min(5).max(50),
    lastName: z.string().min(5).max(50),
    email: z.string().min(5).max(50),
    role: z.string().min(5).max(50),
    isActive: z.boolean(),
    permissons: z.string().min(5).max(250),
  })
);
