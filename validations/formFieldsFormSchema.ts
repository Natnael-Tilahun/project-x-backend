import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { DataType, TransferParams } from "@/global-types";

const DataTypeSchema = z.nativeEnum(DataType).nullable();
const TransferParamsSchema = z.nativeEnum(TransferParams).nullable();
export const formFieldsFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    defaultLanguageCode: z.string().optional().nullable(),
    dataType: DataTypeSchema,
    isUnique: z.boolean().optional().nullable(),
    name: z.string().nullable(),
    label: z.string().nullable(),
    maxLength: z.number().optional().nullable(),
    minLength: z.number().optional().nullable(),
    minValue: z.string().optional().nullable(),
    maxValue: z.string().optional().nullable(),
    isRequired: z.boolean().optional().nullable(),
    trim: z.boolean().optional().nullable(),
    defaultUserValue: z.boolean().optional().nullable(),
    readonly: z.boolean().optional().nullable(),
    transferMapping: TransferParamsSchema,
    sortOrder: z.number().optional().nullable(),
    width: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    placeHolder: z.string().optional().nullable(),
    validationPattern: z.string().optional().nullable(),
    validation: z.string().optional().nullable(),
    iInterface: z.string().optional().nullable(),
    options: z.string().optional().nullable(),
    display: z.string().optional().nullable(),
    displayOptions: z.string().optional().nullable(),
    conditions: z.string().optional().nullable(),
    validationMessage: z.string().optional().nullable(),
    form: z.string().optional().nullable(),
  })
);

// id?: string;
// defaultLanguageCode?: string | null;
// dataType?: DataType | null;
// isUnique?: boolean | null;
// name?: string | null;
// label?: string | null;
// maxLength?: number | null;
// minLength?: number | null;
// minValue?: string | null;
// maxValue?: string | null;
// isRequired?: boolean | null;
// trim?: boolean | null;
// defaultUserValue?: boolean | null;
// readonly?: boolean | null;
// transferMapping?: TransferParams | null;
// sortOrder?: number | null;
// width?: string | null;
// note?: string | null;
// placeHolder?: string | null;
// validationPattern?: string | null;
// validation?: string | null;
// iInterface?: string | null;
// options?: string | null;
// display?: string | null;
// displayOptions?: string | null;
// conditions?: string | null;
// validationMessage?: string | null;
// form?: Form | null;