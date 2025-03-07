import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { RoleScope, PermissionGroupStatus } from "../global-types";

const scopeSchema = z.nativeEnum(RoleScope);
const statusSchema = z.nativeEnum(PermissionGroupStatus).optional().default(PermissionGroupStatus.ACTIVE);

export const permissionGroupFormSchema = toTypedSchema(
  z.object({
    groupCode: z.string(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    scope: scopeSchema,
    status: statusSchema,
  })
);



