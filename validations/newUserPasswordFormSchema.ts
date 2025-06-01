import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUserPasswordFormSchema = toTypedSchema(
  z
    .object({
      // newPassword: z.string().min(6),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
          /[^A-Za-z0-9]/,
          "Password must contain at least one special character"
        ),
      confirmPassword: z.string().min(8).max(50),
    })
    .refine((data) => data.newPassword == data.confirmPassword, {
      message: "Password don't match!",
      path: ["confirmPassword"],
    })
);
