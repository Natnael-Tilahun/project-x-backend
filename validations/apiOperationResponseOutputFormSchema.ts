import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const apiOperationResponseOutputFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    outputName: z.string().min(1, { message: "Output name is required" }),
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
    responseValuePath: z.string(),
    responseScope: z.nativeEnum(["RESPONSE", "HEADER", "ERROR", "NONE"]),
    // transferCoreMapping: z.nativeEnum([
    //   "AMOUNT",
    //   "CREDIT_ACCOUNT",
    //   "REASON",
    //   "NONE",
    // ]),
    //isLogicField: z.boolean().optional().nullable(),
    //constantValueToCompare: z.string().optional().nullable(),
    //operatorToCompareValue: z.nativeEnum([
    //   "EQUAL_TO",
    //   "NOT_EQUAL_TO",
    //   "OBJECT_EQUAL_TO",
    //   "OBJECT_NOT_EQUAL_TO",
    //   "GREATER_THAN",
    //   "LESS_THAN",
    //   "GREATER_THAN_OR_EQUAL_TO",
    //   "LESS_THAN_OR_EQUAL_TO",
    //   "NONE",
    // ]),
    isRequired: z.boolean(),
    // isVisibleForUser: z.boolean().optional().nullable(),
    apiOperation: z.any().optional().nullable(),
  })
);
