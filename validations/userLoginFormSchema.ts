import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const userLoginFormSchema = toTypedSchema(
  z.object({
    username: z.string({ required_error: "Username is required." }),
    password: z.string().min(6),
    rememberMe: z.boolean().optional().default(false),
  })
);
