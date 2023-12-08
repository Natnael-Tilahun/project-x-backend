import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const forgotPasswordFormSchema = toTypedSchema(
  z
    .object({
      email: z.string(),
      newPassword: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .refine((data) => data.newPassword == data.confirmPassword, {
      message: "Password don't match!",
      path: ["confirmPassword"],
    })
);
