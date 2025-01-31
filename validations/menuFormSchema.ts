import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { MenuLayoutType, PaginationType } from "@/global-types";

const MenuLayoutTypeSchema = z.nativeEnum(MenuLayoutType).optional().nullable();
const PaginationTypeSchema = z.nativeEnum(PaginationType).optional().nullable();

export const menuFormSchema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    defaultLanguageCode: z.string().optional().nullable(),
    menuName: z.string().nullable(),
    menuDescription: z.string().optional().nullable(),
    iconPath: z.string().optional().nullable(),
    enabled: z.boolean().optional().nullable(),
    dynamicPaymentMenus: z.array(z.any()).optional().nullable(),
    children: z.array(z.any()).optional().nullable(),
    menuLayoutType: MenuLayoutTypeSchema,
    gridNumberOfColumns: z.number().optional().nullable(),
    sortOrder: z.number().optional().nullable(),
    paginationType: PaginationTypeSchema,
    paginationSize: z.number().optional().nullable(),
    isSuperParent: z.boolean().optional().nullable(),
    isImage: z.boolean().optional().nullable(),
  })
);
