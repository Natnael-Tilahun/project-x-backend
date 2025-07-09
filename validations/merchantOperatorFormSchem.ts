import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { OperatorRole } from "@/global-types";


export const merchantOperatorFormSchem = toTypedSchema(
  z.object({
    firstName: z.string().optional().nullable(),
    middleName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    merchantOperatorId: z.string().optional().nullable(),
    merchantBranchId: z.string().optional().nullable(),
    operatorRole: z.string(),
    active: z.boolean().optional().nullable(),
    operatorCode: z.string().optional()
  })
);
