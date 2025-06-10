import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import AuthConfigurationsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { AuthConfiguration } from "~/types";

export const columns: ColumnDef<AuthConfiguration>[] = [
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
    accessorKey: "authConfigName",
    header: "Auth Config Name",
    cell: ({ row }) => {
      const route = useRoute();
      const name = row.getValue("authConfigName");
      return name
        ? h(
            NuxtLink,
            {
              class: "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/authConfigDetails/${row.original.id}`,
            },
            name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "authConfigDescription",
    header: "Auth Config Description",
    cell: ({ row }) => {
      const description = row.getValue("authConfigDescription");
      return description ? h("p", description) : h("p", "-");
    },
  },
  {
    accessorKey: "authType",
    header: "Auth Type",
    cell: ({ row }) => {
      const authType = row.getValue("authType");
      return authType ? h("p", authType) : h("p", "-");
    },
  },
  {
    accessorKey: "grantType",
    header: "Grant Type",
    cell: ({ row }) => {
      const grantType = row.getValue("grantType");
      return grantType ? h("p", grantType) : h("p", "-");
    },
  },
  {
    accessorKey: "scope",
    header: "Scope", 
    cell: ({ row }) => {
      const scope = row.getValue("scope");
      return scope ? h("p", scope) : h("p", "-");
    },
  },
  {
    accessorKey: "tokenUrl",
    header: "Token URL",
    cell: ({ row }) => {
      const tokenUrl = row.getValue("tokenUrl");
      return tokenUrl ? h("p", tokenUrl) : h("p", "-");
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
        h(AuthConfigurationsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
