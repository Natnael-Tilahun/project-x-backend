import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";


export const apiIntegrationImportFormSchema = toTypedSchema(
  z.object({
    apiIntegrationFile: z.any().optional().nullable(),
  })
);
