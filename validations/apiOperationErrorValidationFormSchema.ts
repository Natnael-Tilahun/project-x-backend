import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LogicalOperators, Operators, LogicalErrorType, DataType } from "@/global-types";

// LogicalRule schema
const logicalRuleSchema = z.object({
  jsonPath: z.string().min(1, "JSON Path is required"),
  operator: z.nativeEnum(Operators),
  expectedValue: z.any(),
  expectedDataType: z.nativeEnum(DataType),
  errorCode: z.string().min(1, "Error code is required"),
  errorMessage: z.string().nullable().optional(), // allow optional and nullable
  errorMessageFromPath: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (!data.errorMessageFromPath) {
    // If errorMessageFromPath is false or undefined, errorMessage is required and not null/empty
    if (!data.errorMessage || data.errorMessage.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Error message is required when errorMessageFromPath is false",
        path: ["errorMessage"],
      });
    }
  }
});

// LogicalRuleGroup schema
const logicalRuleGroupSchema = z.object({
  type: z.nativeEnum(LogicalOperators),
  rules: z.array(logicalRuleSchema).min(1, "At least one rule is required"),
  errorCode: z.string().min(1, "Error code is required"),
  errorMessage: z.string().min(1, "Error message is required"),
  errorMessageFromPath: z.boolean(),
});

// LogicalErrorDefinition schema
const logicalErrorDefinitionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logicalErrorType: z.nativeEnum(LogicalErrorType),
  rollback: z.boolean(),
  priority: z.number().int().min(1, "Priority is required"),
  rule: logicalRuleSchema.optional().nullable(),
  ruleGroup: logicalRuleGroupSchema.optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.logicalErrorType === "RULE") {
    if (!data.rule) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rule is required when type is RULE",
        path: ["rule"],
      });
    }
  } else if (data.logicalErrorType === "RULE_GROUP") {
    if (!data.ruleGroup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rule group is required when type is RULE_GROUP",
        path: ["ruleGroup"],
      });
    }
  }
});

// Main schema
export const apiOperationErrorValidationFormSchema = toTypedSchema(
  z.object({
    logicalErrorDefinitionSet: z
      .array(logicalErrorDefinitionSchema)
      .min(1, "At least one logical error definition is required"),
  })
);
