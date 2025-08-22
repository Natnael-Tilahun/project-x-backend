import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LogicalOperators, Operators } from "@/global-types";

const logicalOperatorSchema = z.nativeEnum(LogicalOperators);
const operatorSchema = z.nativeEnum(Operators);

export const apiOperationResponseOutputValidationRulesFormSchema =
  toTypedSchema(
    z.object({
      validationRules: z
        .array(
          z.object({
            operator: operatorSchema.optional().nullable(),
            against: z
              .array(z.string())
              .optional()
              .nullable(),
            errorMessage: z.string().optional().nullable(),
          })
        )
        .optional()
        .nullable(),
      logicalOperator: logicalOperatorSchema.optional().nullable(),
    }).superRefine((data, ctx) => {
      // If logicalOperator is empty/null/NONE, allow everything to be empty
      if (!data.logicalOperator || data.logicalOperator === LogicalOperators.NONE) {
        return true;
      }
  
      // If logicalOperator has a value, validationRules must be present and valid
      if (!data.validationRules || !Array.isArray(data.validationRules) || data.validationRules.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Validation rules are required when logical operator is selected",
          path: ["validationRules"],
        });
        return false;
      }
  
      // Check each validation rule
      data.validationRules.forEach((rule, index) => {
        if (!rule.operator) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Operator is required",
            path: ["validationRules", index, "operator"],
          });
        }
        // Only validate against field if operator is selected
        if (rule.operator) {
          if (!rule.against || !Array.isArray(rule.against) || rule.against.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one value is required when operator is selected",
              path: ["validationRules", index, "against"],
            });
          }
        }
      });
  
      return true;
    })
  );
