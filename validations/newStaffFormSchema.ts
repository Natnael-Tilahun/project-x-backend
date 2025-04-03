import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newStaffFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    firstname: z.string().nullable(),
    lastname: z.string().nullable(),
    displayName: z.string().optional().nullable(),
    mobileNo: z.string(),
    emailAddress: z.string().optional().nullable(),
    active: z.boolean().default(true),
    joiningDate: z.union([z.string(), z.date()]).optional().nullable(),
  })
);