import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Platform, AppVersionStatus, UpdatePolicy } from "@/global-types";

const PlatformSchema = z.nativeEnum(Platform).optional().nullable();
const AppVersionStatusSchema = z.nativeEnum(AppVersionStatus).nullable();
const UpdatePolicySchema = z.nativeEnum(UpdatePolicy).optional().nullable();

export const applicationVersionFormSchema = toTypedSchema(
  z.object({
    createdBy: z.string().optional().nullable(),
    createdDate: z.string().optional().nullable(),
    lastModifiedBy: z.string().optional().nullable(),
    lastModifiedDate: z.string().optional().nullable(),
    id: z.string().optional().nullable(),
    application: z.any().optional().nullable(),
    versionName: z.string().nullable(),
    versionNumber: z.string().nullable(),
    buildNumber: z.string().optional().nullable(),
    minRequiredVersion: z.string().nullable(),
    apiKeyHash: z.string().optional().nullable(),
    allowedChecksum: z.string().optional().nullable(),
    releaseNotes: z.string().optional().nullable(),
    releaseDate: z.string().optional().nullable(),
    updatePolicy: UpdatePolicySchema,
    isRevoked: z.boolean().optional().nullable(),
    enabled: z.boolean().optional().nullable(),
    status: AppVersionStatusSchema,
  })
);
