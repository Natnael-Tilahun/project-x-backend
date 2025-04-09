import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUssdMenuNamesFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    menuLanguageId: z.string(),
    languageId: z.string(),
    menuName: z.string(),
    visible: z.boolean().nullable().optional().default(true),
    displayOrder: z.number().nullable().optional(),
  })
);