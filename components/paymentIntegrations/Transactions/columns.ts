import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "~/components/ui/checkbox";
import DataTableColumnHeaderVue from "~/components/ui/dataTable/ColumnHeader.vue";
import { Badge } from "~/components/ui/badge";
import PaymentIntegrationTransactionsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import { h, inject } from "vue"; // Import inject
import type { ApiOperation, ThirdPartyTransactionDetail } from "~/types";


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<ThirdPartyTransactionDetail>[] => [
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
      const route = useRoute();
      const name = row.getValue("name");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=transactionDetails&transactionId=${row.original.id}`,
            },
            name
          )
        : h(
          NuxtLink,
          {
            class:
              "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
            to: `${route.path}?activeTab=transactionDetails&transactionId=${row.original.id}`,
          },
          "View Transaction Details"
        );
    },
  },
  {
    accessorKey: "creditAccountNumber",
    header: "Credit Account Number",
    cell: ({ row }) => {
      const creditAccountNumber	 = row.getValue("creditAccountNumber");
      return creditAccountNumber	 ? h("p", creditAccountNumber	) : h("p", "-");
    },
  },
  {
    accessorKey: "amount",
    header: "amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount");
      return amount ? h("p", amount) : h("p", "-");
    },
  },
  {
    accessorKey: "computedPaymentDetailShort",
    header: "Computed Payment Detail Short",
    cell: ({ row }) => {
      const computedPaymentDetailShort = row.getValue("computedPaymentDetailShort");
      return computedPaymentDetailShort
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("computedPaymentDetailShort")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "enquiryApiResponseData",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("enquiryApiResponseData")?.Status;
      if (status == "SUCCESS" ) {
        return h(Badge, { class: "bg-green-600  " }, status);
      }
      else if(status == "FAILURE") {
        return h(Badge, { class: "bg-red-500 " }, status)
      }
      else if(status == "VALIDATION_ERROR") {
        return h(Badge, { class: "bg-brown-500 " }, status)
      }
      else if(status == "PENDING") {
        return h(Badge, { class: "bg-yellow-500 " }, status)
      } 
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
        h(PaymentIntegrationTransactionsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
