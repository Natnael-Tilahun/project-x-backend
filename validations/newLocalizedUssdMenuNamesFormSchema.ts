import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LanguageRelatedStatus } from "~/global-types";

export const newLocalizedUssdMenuNamesFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    menuLanguageId: z.any(),
    languageId: z.string(),
    message: z.string(),
    status: z.boolean().default(true),
  })
);