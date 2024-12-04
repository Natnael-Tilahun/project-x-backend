import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { FormType, } from "@/global-types";

const FormTypeSchema = z.nativeEnum(FormType)

export const formsSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    formName: z.string().nullable(),
    formDescription: z.string().optional().nullable(),
    defaultLanguageCode: z.string().optional().nullable(),
    formType: FormTypeSchema,
    stepOrder: z.number().nullable(),
    paymentOperation: z.string().optional().nullable(),
    locals: z.array(z.string()).optional().nullable(),
    fields: z.array(z.any()).optional().nullable(),
  })
);