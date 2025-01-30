import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import {
  DataType,
  TransferMapping,
  Width,
  AutoCompleteTrigger,
  Display,
  InterfaceType,
  GenerationType,
  DateStepUnit,
} from "@/global-types";

const DataTypeSchema = z.nativeEnum(DataType).nullable();
const TransferMappingSchema = z.nativeEnum(TransferMapping).nullable();
const WidthSchema = z.nativeEnum(Width).nullable();
const AutoCompleteTriggerSchema = z
  .nativeEnum(AutoCompleteTrigger)
  .optional()
  .nullable();
const DisplaySchema = z.nativeEnum(Display).nullable();
const InterfaceTypeSchema = z.nativeEnum(InterfaceType);
const DateStepUnitSchema = z.nativeEnum(DateStepUnit).nullable();
const GenerationTypeSchema = z.nativeEnum(GenerationType).nullable();

export const formFieldsFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    defaultLanguageCode: z.string().optional().nullable(),
    dataType: DataTypeSchema,
    isUnique: z.boolean().optional().nullable(),
    name: z.string().nullable(),
    label: z.string().nullable(),
    maxLength: z.number().optional().nullable(),
    minLength: z.number().optional().nullable(),
    minValue: z.string().optional().nullable(),
    maxValue: z.string().optional().nullable(),
    defaultValue: z.string().optional().nullable(),
    isRequired: z.boolean().optional().nullable(),
    readonly: z.boolean().optional().nullable(),
    transferMapping: TransferMappingSchema,
    sortOrder: z.number().optional().nullable(),
    width: WidthSchema,
    validationPattern: z.string().optional().nullable(),
    autoGenerateConfig: z.any().optional().nullable(),
    isHidden: z.boolean().optional().nullable(),
    interfaceType: InterfaceTypeSchema,
    options: z.any().optional().nullable(),
    display: DisplaySchema.optional().nullable(),
    displayOptions: z.any().optional().nullable(),
    validationConfig: z.any().optional().nullable(),
    validationMessage: z.string().optional().nullable(),
    form: z.any().optional().nullable(),
    rememberValue: z.boolean().optional().nullable(),
    rememberExpiryDays: z.number().optional().nullable(),
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
// defaultValue?: boolean | null; //changed
// isRequired?: boolean | null;
// readonly?: boolean | null;
// transferMapping?: TransferParams | null;
// sortOrder?: number | null;
// width?: Width | null;
// validationPattern?: string | null;
// autoGenerateConfig?: AutoGenerateConfig | null;
// isHidden?: boolean | null;
// interfaceType?: InterfaceType | null;
// options?: Options | null;
// display?: Display | null;
// displayOptions?: DisplayOptions | null;
// validationConfig?: ValidationConfig | null;
// validationMessage?: string | null;
// form?: Form | null;
