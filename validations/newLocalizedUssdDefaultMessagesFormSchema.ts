import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newLocalizedUssdDefaultMessagesFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    defaultMessageId: z.string(),
    languageId: z.string(),
    message: z.string(),
    status: z.any(),
    // title: z.string(),
  })
);