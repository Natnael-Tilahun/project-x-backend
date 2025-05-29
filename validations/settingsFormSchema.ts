import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const settingsFormSchema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(5).max(50),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
      confirmPassword: z.string().min(8).max(50),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match!",
      path: ["confirmPassword"],
    })
);
