import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import MenusDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import { h, inject } from "vue"; // Import inject
import type { Menu } from "~/types";


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Menu>[] => [
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
    accessorKey: "menuDescription",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("menuDescription");
      return description ? h("p", description) : h("p", "-");
    },
  },
  {
    accessorKey: "menuLayoutType",
    header: "Layout Type",
    cell: ({ row }) => {
      const menuLayoutType = row.getValue("menuLayoutType");
      return menuLayoutType ? h("p", menuLayoutType) : h("p", "-");
    },
  },
  {
    accessorKey: "gridNumberOfColumns",
    header: "Grid Num Of Columns",
    cell: ({ row }) => {
      const gridNumberOfColumns = row.getValue("gridNumberOfColumns");
      return gridNumberOfColumns ? h("p", gridNumberOfColumns) : h("p", "-");
    },
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
    cell: ({ row }) => {
      const sortOrder = row.getValue("sortOrder");
      return sortOrder ? h("p", sortOrder) : h("p", "-");
    },
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled");
      return h(
        Badge,
        {
          class:
            `max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium ${enabled ? "bg-green-500": "bg-red-500"}`,
        },
        row.getValue("enabled") ? "Enabled" : "Disabled"
      );
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
          refetch
        })
      );
    },
  },
];
