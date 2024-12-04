import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const menuFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    defaultLanguageCode: z.string().optional().nullable(),
    menuName: z.string().nullable(),
    menuDescription: z.string().optional().nullable(),
    iconPath: z.string().optional().nullable(),
    enabled: z.boolean().optional().nullable(),
    dynamicPaymentMenus: z.array(z.any()).optional().nullable(),
    children: z.array(z.any()).optional().nullable(),
  })
);