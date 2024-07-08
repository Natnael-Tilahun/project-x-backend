import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newMerchantFormSchema = toTypedSchema(
  z.object({
    customerId: z.string(),
    businessType: z.string().min(2),
    businessNumber: z.string(),
    businessName: z.string().min(2),
    tradeLicenseNumber: z.string(),
    tradeLicenseIssueDate: z.string(),
    tradeLicenseExpiryDate: z.string(),
    taxPayerIdNumber: z.string(),
    taxPayerIssueDate: z.string(),
    taxPayerExpiryDate: z.string(),
    city: z.string().optional(),
    businessEmail: z.string().optional(),
    businessPhoneNumber: z.string(),
    postalNumber: z.string().optional(),
    faxNumber: z.string().optional(),
    shortCode: z.string().optional(),
  })
);
