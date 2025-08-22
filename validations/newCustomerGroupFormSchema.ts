import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { CustomerGroupType } from "~/global-types";

const CustomerGroupTypeSchema = z.nativeEnum(CustomerGroupType);


export const newCustomerGroupFormSchema = toTypedSchema(
  z.object({
    id: z.any().optional().nullable(),
    groupCode: z.string(),
    groupName: z.string(),
    description: z.string().min(0).max(2000).optional().nullable(),
    priorityLevel: z.number().optional(),
    isActive: z.boolean().default(true).nullable(),
    groupType: CustomerGroupTypeSchema
  })
);