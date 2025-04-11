import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUssdLanguageFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    languageName: z.string(),
    languageType: z.string(),
    status: z.string().optional().nullable(),
  })
);