import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import IntegrationsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ApiIntegration } from "~/types";
import { h, inject } from "vue"; // Import inject


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<ApiIntegration>[] => [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const route = useRoute();
      const name = row.getValue("name");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${row.original.id}`,
            },
            name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description ? h("p", description) : h("p", "-");
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.getValue("url");
      return url ? h("p", url) : h("p", "-");
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return type ? h("p", type) : h("p", "-");
    },
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => {
      const version = row.getValue("version");
      return version
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("version")
          )
        : h("p", "-");
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
        h(IntegrationsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
