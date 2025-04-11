import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newUssdDefaultMessagesFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    message: z.string(),
    title: z.string(),
  })
);