import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { OperatorRole } from "@/global-types";


export const newMerchantOperatorFormSchem = toTypedSchema(
  z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string().optional().nullable(),
    branchId: z.string().optional().nullable(),
    operatorRoleId: z.string(),
    active: z.boolean().optional().default(true),
    operatorCode: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50),
    confirmPassword: z.string().min(6).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  })
);
