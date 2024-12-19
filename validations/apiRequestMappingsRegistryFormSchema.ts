import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const apiRequestMappingsRegistryFormSchema = toTypedSchema(
  z.object({
    apiRequestInputName: z.string(),
    mappingPath: z.string(),
  })
);