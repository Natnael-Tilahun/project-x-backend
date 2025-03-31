import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newStaffFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    displayName: z.string().optional().nullable(),
    mobileNo: z.string(),
    externalId: z.string().optional().nullable(),
    emailAddress: z.string().optional().nullable(),
    loanOfficer: z.boolean().default(false),
    organisationalRoleType: z.number().optional().nullable(),
    active: z.boolean().default(true),
    joiningDate: z.union([z.string(), z.date()]).optional().nullable(),
    office: z.any(),
    organisationalRoleParentStaff: z.string().optional().nullable()
  })
);