import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newStaffAssignmentsFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    assignmentDate: z.union([z.string(), z.date()]),
    // endDate: z.union([z.string(), z.date()]).optional().nullable(),
    staffId: z.string(),
    supervisorStaffId: z.string().optional().nullable(),
    newOfficeId: z.string(),
    newRoleId: z.string(),
    remarks: z.string().optional(),
  })
);