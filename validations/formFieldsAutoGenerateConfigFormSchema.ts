import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { DataType, GenerationType, DateStepUnit } from "@/global-types";

const DataTypeSchema = z.nativeEnum(DataType).optional().nullable();
const DateStepUnitSchema = z.nativeEnum(DateStepUnit).optional().nullable();
const GenerationTypeSchema = z.nativeEnum(GenerationType).nullable();

export const formFieldsAutoGenerateConfigFormSchema = toTypedSchema(
  z.object({
    enabled: z.boolean().optional().nullable(),
    generationType: GenerationTypeSchema,
    dataType: DataTypeSchema,
    prefix: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
    length: z.number().optional().nullable(),
    allowManualOverride: z.boolean().optional().nullable(),
    minValue: z.number().optional().nullable(),
    maxValue: z.number().optional().nullable(),
    step: z.number().optional().nullable(),
    padding: z.boolean().optional().nullable(),
    paddingLength: z.number().optional().nullable(),
    reservedValues: z.array(z.number()).optional().nullable(),
    excludePatterns: z.array(z.string()).optional().nullable(),
    pattern: z.string().optional().nullable(),
    allowedChars: z.string().optional().nullable(),
    uuidVersion: z.number().optional().nullable(),
    uuidNamespace: z.string().optional().nullable(),
    startDate: z.string().optional().nullable(),
    startDateTime: z.string().optional().nullable(),
    dateFormat: z.string().optional().nullable(),
    dateTimeFormat: z.string().optional().nullable(),
    timezone: z.string().optional().nullable(),
    dateStep: z.number().optional().nullable(),
    dateStepUnit: DateStepUnitSchema,
    unique: z.boolean().optional().nullable(),
    retryAttempts: z.number().optional().nullable(),
    collisionStrategy: z.string().optional().nullable(),
    logValues: z.boolean().optional().nullable(),
    auditEnabled: z.boolean().optional().nullable(),
    obfuscation: z.boolean().optional().nullable(),
    encryption: z.boolean().optional().nullable(),
    dependentOn: z.string().optional().nullable(),
    customRule: z.string().optional().nullable(),
    batchSize: z.number().optional().nullable(),
    concurrency: z.number().optional().nullable(),
    validationRegex: z.string().optional().nullable(),
    postValidation: z.boolean().optional().nullable(),
  })
);
