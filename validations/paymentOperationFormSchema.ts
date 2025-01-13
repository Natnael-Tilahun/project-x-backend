import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import {
  PaymentIntegrationType,
  Visibility,
  TransactionAmountType,
  PaymentOperationType,
  FormType,
} from "@/global-types";

const IntegrationTypeSchema = z.nativeEnum(PaymentIntegrationType);
const TransactionAmountTypeSchema = z.nativeEnum(TransactionAmountType);
const VisibilitySchema = z.nativeEnum(Visibility);
const PaymentOperationTypeSchema = z.nativeEnum(PaymentOperationType);
const FormTypeSchema = z.nativeEnum(FormType).nullable().optional();

export const paymentOperationFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string().nullable(),
    description: z.string().optional().nullable(),
    paymentOperationType: PaymentOperationTypeSchema,
    apiOperation: z.string().nullable(),
    paymentIntegration: z.string().optional().nullable(),
    form: z.any().optional().nullable(),
    prevPaymentOperation: z.string().optional().nullable(),
    nextPaymentOperation: z.string().optional().nullable(),
    apiRequestMappingsRegistry: z
      .array(
        z.object({
          apiRequestInputName: z.string(),
          mappingPath: z.string(),
        })
      )
      .optional()
      .nullable(),
    apiRequestMappingsRegistryOptions: z
      .object({
        [z.string()]: z.array(z.string()),
      })
      .optional()
      .nullable(),
    amountEnquiryPath: z.string().optional().nullable(),
  })
);
