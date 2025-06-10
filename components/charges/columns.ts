import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import ChargesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Charge } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Charge>[] => [
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
    accessorKey: "chargeCode",
    header: "Charge Code",
    cell: ({ row }) => {
      const route = useRoute();
      const chargeCode = row.getValue("chargeCode");
      const id = row.original.id;
      return chargeCode
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${id}`,
            },
            chargeCode
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Application Description",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "categoryAccount",
    header: "Category Account",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("isActive");
      if (status) {
        return h(Badge, { class: "bg-green-600  " }, "Enabled");
      } else return h(Badge, { class: "bg-red-500 " }, "Disabled");
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
        h(ChargesDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
