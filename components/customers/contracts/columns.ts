import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../../ui/checkbox";
import DataTableColumnHeaderVue from "../../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../../ui/badge";
import CustomersContractsDataTableRowActionsVue from "./DataTableRowActions.vue"
import { NuxtLink } from "#components";
import type { Contract } from "~/types";
import { h } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Contract>[] => [
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
      const contractId = row.original.id;
      const route = useRoute();
      const name = row.getValue("name");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/contracts/${contractId}`,
            },
            row.getValue("name")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "serviceType",
    header: "Service Type",
    cell: ({ row }) => {
      const serviceType = row.getValue("serviceType");
      return serviceType
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("serviceType")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description
        ? h(
          "div",
          {
            class:
              "whitespace-nowrap truncate hover:w-full font-medium",
          },
          row.getValue("description")
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
        h(CustomersContractsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
