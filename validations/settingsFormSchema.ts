import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const settingsFormSchema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(5).max(50),
      newPassword: z.string().min(6).max(50),
      confirmPassword: z.string().min(6).max(50),
    })
    .refine((data) => data.newPassword == data.confirmPassword, {
      message: "Password don't match!",
      path: ["confirmPassword"],
    })
);
