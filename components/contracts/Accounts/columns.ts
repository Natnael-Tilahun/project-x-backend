import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "@/components/ui/checkbox";
import DataTableColumnHeaderVue from "@/components/ui/dataTable/ColumnHeader.vue";
import { Badge } from "@/components/ui/badge";
import ContractsCoreCustomersDataTableRowActions from "@/components/contracts/CoreCustomers/DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ContractAccount } from "~/types";

export const columns: ColumnDef<ContractAccount>[] = [
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
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => {
      const id = row.original.id;
      const route = useRoute();
      return id
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?contractAccountId=${id}`,
            },
            row.getValue("id")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "contract",
    header: "Contract",
    cell: ({ row }) => {
      const contract = row.getValue("contract");
      return contract
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("contract")?.name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "coreCustomer",
    header: "Core Customer Id",
    cell: ({ row }) => {
      const coreCustomer = row.original.coreCustomer;
      const route = useRoute();
      return coreCustomer
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=contractCoreCustomerDetails&&coreCustomerId=${coreCustomer?.id}`,
            },
            row.getValue("coreCustomer")?.id
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "enable",
    header: "Enable",
    cell: ({ row }) => {
      const enable = row.getValue("enable");
      return enable
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
            row.getValue("permissions").length
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
