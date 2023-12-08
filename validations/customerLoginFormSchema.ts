import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const customerLoginFormSchema = toTypedSchema(
  z.object({
    email: z.string(),
    password: z.string().min(6),
  })
);
