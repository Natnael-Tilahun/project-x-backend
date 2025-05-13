import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newStaffFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    firstname: z.string(),
    lastname: z.string(),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    displayName: z.string().optional().nullable(),
    mobileNo: z.string().optional().nullable(),
    emailAddress: z.string().nullable(),
    active: z.boolean().optional().default(true).nullable(),
    joiningDate: z.union([z.string(), z.date()]).optional().nullable(),
  })
);