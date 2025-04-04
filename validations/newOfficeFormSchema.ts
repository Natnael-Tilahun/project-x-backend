import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newOfficeFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional().nullable(),
    name: z.string(),
    code: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    organizationRegion: z.string().nullable().optional(),
    districtName: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    hierarchy: z.string().nullable().optional(),
    openingDate: z.union([z.string(), z.date()]),
    parent: z.any().nullable().optional()
  })
);