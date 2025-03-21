import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "@/components/ui/checkbox";
import DataTableColumnHeaderVue from "@/components/ui/dataTable/ColumnHeader.vue";
import { Badge } from "@/components/ui/badge";
import ContractsCoreCustomersDataTableRowActions from "@/components/contracts/CoreCustomers/DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ContractCoreCustomer } from "~/types";

export const columns: ColumnDef<ContractCoreCustomer>[] = [
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
    accessorKey: "coreCustomerId",
    header: "Core Customer Id",
    cell: ({ row }) => {
      const coreCustomerId = row.original.id;
      const route = useRoute();
      return coreCustomerId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=contractCoreCustomerDetails&&coreCustomerId=${coreCustomerId}`,
            },
            row.getValue("coreCustomerId")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "enable",
    header: "Enable",
    cell: ({ row }) => {
      const enable = row.getValue("enable");
      return enable != null
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("enable")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.getValue("permissions");
      return permissions
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("permissions")?.length
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
        h(ContractsCoreCustomersDataTableRowActions, {
          row,
        })
      );
    },
  },
];
