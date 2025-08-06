import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { RoleScope } from "~/global-types";

// Define the Permission schema
const PermissionSchema = z.object({
  createdBy: z.string().optional(),
  createdDate: z.date().optional(),
  lastModifiedBy: z.string().optional(),
  lastModifiedDate: z.date().optional(),
  grouping: z.string(),
  code: z.string(),
  entityName: z.string(),
  actionName: z.string(),
  description: z.string().min(0).max(50),
  selected: z.boolean().optional(),
});

const scopeSchema = z.nativeEnum(RoleScope).optional();


export const rolesFormSchema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "Name is required." }),
    description: z.string().optional(),
    enforce2fa: z.boolean().optional().default(true),
    effectiveToAllBranch: z.boolean().default(false).optional(),
    enabled: z.boolean().optional().default(true),
    scope: scopeSchema,
    permissions: z.array(z.any()).optional(),
  })
);



