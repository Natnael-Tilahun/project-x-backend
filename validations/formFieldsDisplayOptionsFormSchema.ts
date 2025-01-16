import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { DataType, GenerationType, DateStepUnit } from "@/global-types";

const DataTypeSchema = z.nativeEnum(DataType).optional().nullable();
const DateStepUnitSchema = z.nativeEnum(DateStepUnit).optional().nullable();
const GenerationTypeSchema = z.nativeEnum(GenerationType).optional().nullable();

export const formFieldsDisplayOptionsFormSchema = toTypedSchema(
  z.object({
    format: z.boolean().optional().nullable(),
    bold: z.boolean().optional().nullable(),
    color: z.string().optional().nullable(),
    background: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    masked: z.boolean().optional().nullable(),
    prefix: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
    font: z.string().optional().nullable(),
    italic: z.boolean().optional().nullable(),
    border: z.boolean().optional().nullable(),
    relative: z.boolean().optional().nullable(),
    strict: z.boolean().optional().nullable(),
    labelOn: z.string().optional().nullable(),
    labelOff: z.string().optional().nullable(),
    colorOn: z.string().optional().nullable(),
    colorOff: z.string().optional().nullable(),
    iconOn: z.string().optional().nullable(),
    iconOff: z.string().optional().nullable(),
  })
);
