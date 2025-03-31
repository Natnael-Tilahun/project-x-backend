import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newStaffAssignmentsFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    startDate: z.union([z.string(), z.date()]),
    endDate: z.union([z.string(), z.date()]),
    staff: z.any(),
    supervisor: z.any().optional(),
    office: z.any(),
    role: z.any()
  })
);