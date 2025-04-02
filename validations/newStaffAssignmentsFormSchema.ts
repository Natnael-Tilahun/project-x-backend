import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newStaffAssignmentsFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    startDate: z.union([z.string(), z.date()]),
    endDate: z.union([z.string(), z.date()]),
    staff: z.object({
      id: z.string({ required_error: "Staff is required" })
    }),
    supervisor: z.object({
      id: z.string().optional()
    }).optional(),
    office: z.object({
      id: z.string({ required_error: "Office is required" })
    }),
    role: z.object({
      name: z.string({ required_error: "Role is required" })
    })
  })
);