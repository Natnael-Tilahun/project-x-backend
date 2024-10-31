import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const apiOperationRequestInputFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    inputName: z.string(),
    inputType: z.nativeEnum([
      "BODY",
      "HEADER",
      "QUERY",
      "PATH",
      "NONE",
    ]),
    dataType: z.nativeEnum([
      "COLLECTION",
      "STRING",
      "INT",
      "LONG",
      "DOUBLE",
      "BOOLEAN",
      "DATETIME",
      "NONE",
    ]),
    testValue: z.string().optional().nullable(),
    defaultValue: z.string().optional().nullable(),
    valueSource: z.nativeEnum([
      "USER_INPUT",
      "PAYMENT_DETAIL",
      "TRANSACTION_ID",
      "TRANSACTION_DETAILS",
      "TRANSACTION_AMOUNT",
      "CUSTOMER_PHONE",
      "CUSTOMER_EMAIL",
      "CUSTOMER_ACCOUNT",
      "NONE",
      "CUSTOMER",
      "TRANSACTION",
      "ACCOUNT",
      "PROFILE",
    ]),
    isEncoded: z.boolean(),
    maxLength: z.number().optional().nullable(),
    minLength: z.number().optional().nullable(),
    minValue: z.string().optional().nullable(),
    maxValue: z.string().optional().nullable(),
    validationPattern: z.string().optional().nullable(),
    transformationRule: z.any().optional().nullable(),
    isRequired: z.boolean(),
    isHidden: z.boolean().optional().nullable(),
    // apiOperation: z.any().optional().nullable(),
  })
);