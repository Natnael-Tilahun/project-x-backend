import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Platform } from "@/global-types";

const PlatformSchema = z.nativeEnum(Platform).nullable();

export const applicationFormSchema = toTypedSchema(
  z.object({
    createdBy: z.string().optional().nullable(),
    createdDate: z.string().optional().nullable(),
    lastModifiedBy: z.string().optional().nullable(),
    lastModifiedDate: z.string().optional().nullable(),
    id: z.string().optional().nullable(),
    name: z.string().nullable(),
    platform: PlatformSchema,
    downloadUrl: z.string().optional().nullable(),
    bundleId: z.string().optional().nullable(),
    appStoreId: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    iconUrl: z.string().optional().nullable(),
    enabled: z.boolean().optional().nullable(),
    versions: z.array(z.any()).optional().nullable(),
  })
);
