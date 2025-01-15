import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import {
  DataType,
  GenerationType,
  DateStepUnit,
  AutoCompleteTrigger,
} from "@/global-types";

const DataTypeSchema = z.nativeEnum(DataType).optional().nullable();
const DateStepUnitSchema = z.nativeEnum(DateStepUnit).optional().nullable();
const GenerationTypeSchema = z.nativeEnum(GenerationType).optional().nullable();
const AutoCompleteTriggerSchema = z
  .nativeEnum(AutoCompleteTrigger)
  .optional()
  .nullable();

export const formFieldsOptionsFormSchema = toTypedSchema(
  z.object({
    placeholder: z.string().optional().nullable(),
    iconLeft: z.string().optional().nullable(),
    clear: z.boolean().optional().nullable(),
    font: z.string().optional().nullable(),
    trim: z.boolean().optional().nullable(),
    masked: z.boolean().optional().nullable(),
    slug: z.boolean().optional().nullable(),
    choices: z
      .object({
        text: z.string().optional().nullable(),
        value: z.string().optional().nullable(),
        icon: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        isDefault: z.boolean().optional().nullable(),
      })
      .optional()
      .nullable(),
    allowOther: z.boolean().optional().nullable(),
    allowNone: z.boolean().optional().nullable(),
    url: z.string().optional().nullable(),
    resultsPath: z.string().optional().nullable(),
    autoCompleteTrigger: AutoCompleteTriggerSchema,
    minValue: z.number().optional().nullable(),
    maxValue: z.number().optional().nullable(),
    stepInterval: z.number().optional().nullable(),
    alwaysShowValue: z.boolean().optional().nullable(),
  })
);
