import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import PaymentOperationsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";

export const columns: ColumnDef<PaymentOperation>[] = [
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
              to: `${route.path}?activeTab=configurePaymentOperations&operationId=${row.original.id}`,
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
    accessorKey: "paymentOperationType",
    header: "Payment Operation Type",
    cell: ({ row }) => {
      const paymentOperationType = row.getValue("paymentOperationType");
      return paymentOperationType ? h("p", paymentOperationType) : h("p", "-");
    },
  },
  {
    accessorKey: "prevPaymentOperation",
    header: "Previous Payment Operation",
    cell: ({ row }) => {
      const prevPaymentOperation = row.getValue("prevPaymentOperation");
      return prevPaymentOperation
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("prevPaymentOperation").paymentOperationType
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "nextPaymentOperation",
    header: "Next Payment Operation",
    cell: ({ row }) => {
      const nextPaymentOperation = row.getValue("nextPaymentOperation");
      return nextPaymentOperation ? h("p", nextPaymentOperation) : h("p", "-");
    },
  },
  {
    accessorKey: "apiOperation",
    header: "API Operation",
    cell: ({ row }) => {
      const apiOperation = row.getValue("apiOperation");
      return apiOperation
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("apiOperation")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "paymentIntegration",
    header: "Payment Integration",
    cell: ({ row }) => {
      const paymentIntegration = row.getValue("paymentIntegration");
      return paymentIntegration ? h("p", paymentIntegration) : h("p", "-");
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
        h(PaymentOperationsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
