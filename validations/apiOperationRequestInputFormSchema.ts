import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LogicalOperators, InputType, DataType, Operators } from "@/global-types";

const logicalOperatorSchema = z.nativeEnum(LogicalOperators).optional().nullable();
const inputTypeSchema = z.nativeEnum(InputType);
const dataTypeSchema = z.nativeEnum(DataType);
const operatorSchema = z.nativeEnum(Operators);


export const apiOperationRequestInputFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    inputName: z.string().min(1, { message: "Input name is required" }),
    inputType: inputTypeSchema,
    dataType: dataTypeSchema,
    testValue: z.string().optional().nullable(),
    defaultValue: z.string().optional().nullable(),
    valueSourcePath: z.string().optional().nullable(),
    isEncoded: z.boolean(),
    maxLength: z.number().optional().nullable(),
    minLength: z.number().optional().nullable(),
    minValue: z.string().optional().nullable(),
    maxValue: z.string().optional().nullable(),
    validationPattern: z.string().optional().nullable(),
    transformationRule: z.any().optional().nullable(),
    isRequired: z.boolean(),
    isHidden: z.boolean().optional().nullable(),
    apiOperation: z.any().optional().nullable(),
    validationRules: z.array(z.object({
      operator: operatorSchema,
      against: z.any().optional().nullable(),
      errorMessage: z.string().optional().nullable(),
    })).optional().nullable(),
    // operator: operatorSchema,
    // against: z.any().optional().nullable(),
    // errorMessage: z.string().optional().nullable(),
    validationMessage: z.string().optional().nullable(),
    logicalOperator: logicalOperatorSchema,
  })
);
