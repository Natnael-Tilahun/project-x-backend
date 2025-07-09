import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { MerchantCategoryCode, MerchantStatus } from "~/global-types";

const merchantCategoryCodeTypeSchema = z.nativeEnum(MerchantCategoryCode);
const merchantStatusTypeSchema = z.nativeEnum(MerchantStatus).optional().nullable()



export const editMerchantFormSchema = toTypedSchema(
  z.object({
    merchantId: z.string().optional().nullable(),
    businessType: z.string().min(2).optional().nullable(),
    businessNumber: z.string().optional().nullable(),
    businessName: z.string().min(2),
    tradeLicenseNumber: z.string().optional().nullable(),
    tradeLicenseIssueDate: z.string().optional().nullable(),
    tradeLicenseExpiryDate: z.string().optional().nullable(),
    taxPayerIdNumber: z.string().optional().nullable(),
    taxPayerIssueDate: z.string().optional().nullable(),
    taxPayerExpiryDate: z.string().optional().nullable(),
    city: z.string().optional(),
    businessEmail: z.string().optional(),
    businessPhoneNumber: z.string(),
    postalNumber: z.string().optional(),
    faxNumber: z.string().optional().nullable(),
    shortCode: z.string().optional(),
    status: merchantStatusTypeSchema,
    merchantCategoryCode: merchantCategoryCodeTypeSchema,
    defaultPaymentReceivingAccountNumber:	z.string().optional().nullable()
  })
);
