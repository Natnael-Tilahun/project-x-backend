import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { RuleType } from "@/global-types";

const RuleTypeSchema = z.nativeEnum(RuleType).nullable();

export const chargeRuleFormSchema = toTypedSchema(
  z
    .object({
      id: z.number().optional().nullable(),
      ruleType: RuleTypeSchema,
      amountRangeStart: z.number().optional().nullable(),
      amountRangeEnd: z.number().optional().nullable(),
      fixedAmount: z.number().optional().nullable(),
      percentage: z.number().optional().nullable(),
      priority: z.number(),
      charges: z.array(z.any()).optional().nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.ruleType === "FIXED" && data.fixedAmount == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fixedAmount"],
          message: "Fixed amount is required when RuleType is FIXED",
        });
      }
      if (data.ruleType === "PERCENTAGE" && data.percentage == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["percentage"],
          message: "Percentage is required when RuleType is PERCENTAGE",
        });
      }
    })
);
