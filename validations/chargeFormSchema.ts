import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { ChargeType } from "@/global-types";

const ChargeTypeSchema = z.nativeEnum(ChargeType).nullable();

export const chargeFormSchema = toTypedSchema(
  z.object({
    id: z.number().optional().nullable(),
    chargeCode: z.string().nullable(),
    category: z.string().optional().nullable(),
    type: ChargeTypeSchema,
    description: z.string().nullable(),
    categoryAccount: z.string().optional().nullable(),
    isActive: z.boolean().default(false),
    rules: z.array(z.any()).optional().nullable(),
  })
);
