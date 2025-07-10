import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { OperatorRole } from "@/global-types";


export const merchantOperatorResetPasswordFormSchem = toTypedSchema(
  z.object({
    newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50),
    confirmPassword: z.string().min(6).max(50),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  })
);
