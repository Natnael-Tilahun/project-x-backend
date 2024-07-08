import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const profileFormSchema = toTypedSchema(
  z.object({
    // employeeId: z.string().min(5).max(50),
    firstName: z.string().min(5).max(50).optional().nullable(),
    lastName: z.string().min(5).max(50).optional().nullable(),
    phone: z.string().min(9).max(16),
    email: z.string().min(5).max(50),
    // login: z.string().min(5).max(50),
    activated: z.boolean(),
    authorities: z.array(z.string()).min(1).nullable(), // Changed to an array of strings
  })
);
