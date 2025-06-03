import type { ColumnDef } from "@tanstack/vue-table";
import { h, inject } from "vue"; // Import inject
import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UssdMenusDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { UssdMenuList } from "~/types";

type RefetchFunction = () => Promise<void>;

export const columns= (refetch: RefetchFunction): ColumnDef<UssdMenuList>[] => [
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
    header: "Menu Name",
    cell: ({ row }) => {
      const route = useRoute();
      const menuName = row.getValue("menuName");
      return menuName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${row.original.id}`,
            },
            row.getValue("menuName")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "visible",
    header: "Visible",
    cell: ({ row }) => {
      const visible = row.getValue("visible");
      return visible
        ? h(Badge, { class: "bg-green-500" }, "Yes")
        : h(Badge, { class: "bg-red-500" }, "No");
    },
  },
  {
    accessorKey: "displayOrder",
    header: "Display Order",
    cell: ({ row }) => {
      const displayOrder = row.getValue("displayOrder");
      return displayOrder ? h("p", displayOrder) : h("p", "-");
    },
  },
  {
    accessorKey: "child",
    header: "Childs",
    cell: ({ row }) => {
      const child = row.getValue("child");
      return child ? h("p", child?.length) : h("p", "-");
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
        h(UssdMenusDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
