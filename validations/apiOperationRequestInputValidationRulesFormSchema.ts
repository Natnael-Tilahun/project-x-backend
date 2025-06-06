import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LogicalOperators, Operators } from "@/global-types";

const logicalOperatorSchema = z.nativeEnum(LogicalOperators);
const operatorSchema = z.nativeEnum(Operators);

export const apiOperationRequestInputValidationRulesFormSchema = toTypedSchema(
  z.object({
    validationRules: z
      .array(
        z.object({
          operator: operatorSchema,
          against: z
            .array(z.string().min(1, { message: "This field is required" }))
            .optional()
            .nullable(),
          errorMessage: z.string().optional().nullable(),
        })
      )
      .optional()
      .nullable(),
    logicalOperator: logicalOperatorSchema,
  })
);
