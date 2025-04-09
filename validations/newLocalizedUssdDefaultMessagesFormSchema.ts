import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LanguageRelatedStatus } from "~/global-types";
export const newLocalizedUssdDefaultMessagesFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    defaultMessageId: z.string(),
    languageId: z.string(),
    message: z.string(),
    status: z.string().optional().nullable().default(LanguageRelatedStatus.VISIBLE),
    // title: z.string(),
  })
);