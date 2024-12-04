import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import MenusDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";

export const columns: ColumnDef<Menu>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        "onUpdate:checked": (value: boolean) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "menuName",
    header: "Name",
    cell: ({ row }) => {
      const route = useRoute();
      const name = row.getValue("menuName");
      return name
        ? h(
            NuxtLink,
            {
              class: "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/menuDetails/${row.original.id}`,
            },
            name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "menuDescription",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("menuDescription");
      return description ? h("p", description) : h("p", "-");
    },
  },
  {
    accessorKey: "iconPath",
    header: "Icon",
    cell: ({ row }) => {
      const iconPath = row.getValue("iconPath");
      return iconPath ? h("p", iconPath) : h("p", "-");
    },
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled");
      return enabled ? h("p", enabled) : h("p", "-");
    },
  },
  {
    accessorKey: "defaultLanguageCode",
    header: "Default Language Code", 
    cell: ({ row }) => {
      const defaultLanguageCode = row.getValue("defaultLanguageCode");
      return defaultLanguageCode ? h("p", defaultLanguageCode) : h("p", "-");
    },
  },
  {
    accessorKey: "children",
    header: "Children",
    cell: ({ row }) => {
      const children = row.getValue("children");
      return children ? h(
        "div",
          { class: "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
          children.length
        )
      : h("p", "-");
    },
  },
  {
    accessorKey: "dynamicPaymentMenus",
    header: "Dynamic Paymen t Menus",
    cell: ({ row }) => {
      const dynamicPaymentMenus = row.getValue("dynamicPaymentMenus");
      return dynamicPaymentMenus ? h("p", dynamicPaymentMenus.length) : h("p", "-");
    },
  },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(MenusDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
