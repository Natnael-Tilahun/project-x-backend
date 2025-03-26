import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import {
  PaymentIntegrationType,
  Visibility,
  TransactionAmountType,
  PaymentOperationType,
  FormType,
  MaximumAmountVariableType,
  MinimumAmountVariableType,
  CreditAccountNumberVariableType,
  PaymentCategory,
} from "@/global-types";

const IntegrationTypeSchema = z.nativeEnum(PaymentIntegrationType);
const TransactionAmountTypeSchema = z.nativeEnum(TransactionAmountType);
const VisibilitySchema = z.nativeEnum(Visibility);
const PaymentOperationTypeSchema = z
  .nativeEnum(PaymentOperationType)
  .nullable()
  .optional();
const FormTypeSchema = z.nativeEnum(FormType).nullable().optional();
const MaximumAmountVariableTypeSchema = z
  .nativeEnum(MaximumAmountVariableType)
  .nullable()
  .optional();
const MinimumAmountVariableTypeSchema = z
  .nativeEnum(MinimumAmountVariableType)
  .nullable()
  .optional();
const CreditAccountNumberVariableTypeSchema = z
  .nativeEnum(CreditAccountNumberVariableType)
  .nullable()
  .optional();
const PaymentCategorySchema = z.nativeEnum(PaymentCategory).nullable();

export const paymentIntegrationFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    alternateId: z.string().optional().nullable(),
    defaultLanguageCode: z.string().optional().nullable(),
    integrationName: z.string(),
    companyName: z.string(),
    description: z.string().optional().nullable(),
    iconPath: z.string().optional().nullable(),
    isDraft: z.boolean().optional().nullable().default(false),
    enabled: z.boolean().optional().nullable().default(false),
    accountNumber: z.string().optional().nullable(),
    minimumAmount: z.number().optional().nullable(),
    maximumAmount: z.number().optional().nullable(),
    currencyCode: z.string().optional().nullable(),
    paymentConfirmationTemplate: z.string().optional().nullable(),
    paymentDetailTemplate: z.string().optional().nullable(),
    paymentSuccessTemplate: z.string().optional().nullable(),
    paymentErrorTemplate: z.string().optional().nullable(),
    paymentConfirmationTemplateShort: z.string().optional().nullable(),
    paymentDetailTemplateShort: z.string().optional().nullable(),
    paymentSuccessTemplateShort: z.string().optional().nullable(),
    paymentErrorTemplateShort: z.string().optional().nullable(),
    integrationType: IntegrationTypeSchema,
    transactionAmountType: TransactionAmountTypeSchema,
    visiblity: VisibilitySchema,
    confirmRecipientIdentity: z.boolean().optional().nullable().default(false),
    reEnquirePaymentDetailBeforePayment: z.boolean().optional().nullable(),
    singleFormPayment: z.boolean().optional().nullable().default(false),
    defaultPaymentReason: z.string().optional().nullable(),
    // categoryMenus: z.array(z.any()).optional().nullable(),
    locals: z.array(z.any()).optional().nullable(),
    forms: z.array(z.any()).optional().nullable(),
    paymentOperations: z.array(z.any()).optional().nullable(),
    maximumAmountVariableType: MaximumAmountVariableTypeSchema,
    minimumAmountVariableType: MinimumAmountVariableTypeSchema,
    creditAccountNumberVariableType: CreditAccountNumberVariableTypeSchema,
    isImage: z.boolean().optional().nullable(),
    dailyLimitPerAccount: z.number().optional().nullable(),
    limitPerTransaction: z.number().optional().nullable(),
    category: PaymentCategorySchema,
  })
);

// z.object({
//   id: z.string(),
//   name: z.string().optional().nullable(),
//   description: z.string().optional().nullable(),
//   paymentOperationType: PaymentOperationTypeSchema,
//   prevPaymentOperation: z.object({
//     id: z.string(),
//     name: z.string().optional().nullable(),
//     description: z.string().optional().nullable(),
//     paymentOperationType: PaymentOperationTypeSchema,
//     prevPaymentOperation: z.any().optional().nullable(),
//   }).optional().nullable(),
// })

// z.object({
//   id: z.string(),
//   defaultLanguageCode: z.string().optional().nullable(),
//   formName: z.string(),
//   formDescription: z.string().optional().nullable(),
//   formType: FormTypeSchema,
//   stepOrder: z.number().optional().nullable(),
// })
