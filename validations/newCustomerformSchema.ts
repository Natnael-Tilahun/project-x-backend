import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newCustomerformSchema = toTypedSchema(
  z.object({
    // firstName: z.string().min(3).max(15),
    // middleName: z.string().min(3).max(15),
    // lastName: z.string().min(3).max(15),
    // salutation: z.string().optional(),
    // gender: z.string(),
    // addressLine1: z.string(),
    // addressLine2: z.string().optional(),
    // city: z.string(),
    // country: z.string(),
    phone: z.string(),
    email: z.string(),
    nationalId: z.number().optional(),
    // coreCustomerId: z.string(),
    // legacyCustomerId: z.string().optional(),
    // langKey: z.string().optional(),
    // imageUrl: z.any().optional(),
    // olbAllowed: z.boolean().default(false).optional(),
    // staffMember: z.boolean().default(false).optional(),
    // vipcustomer: z.boolean().default(false).optional(),
  })
);
