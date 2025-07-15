import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "~/components/ui/checkbox";
import MerchantsBranchesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { MerchantBranch, MerchantTransaction } from "~/types";
import { h } from "vue"; // Import inject
import { Badge } from "~/components/ui/badge";

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (
  refetch: RefetchFunction
): ColumnDef<MerchantTransaction>[] => [
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
    accessorKey: "merchantTransactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const route = useRoute();
      const merchantTransactionId = row.original.merchantTransactionId;
      return merchantTransactionId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=transactionDetails&transactionId=${merchantTransactionId}`,
            },
            "View Transaction"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "merchantName",
    header: "Merchant Name",
    cell: ({ row }) => {
      const merchantName = row.original.merchantName;
      return merchantName
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("merchantName")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => {
      const businessName = row.original.businessName;
      return businessName
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("businessName")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return amount
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("amount")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.original.paymentStatus;
      return paymentStatus
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("paymentStatus")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus");
      if (paymentStatus == "COMPLETED") {
        return h(Badge, { class: "bg-green-600 " }, row.getValue("paymentStatus"));
      } else if (paymentStatus == "FAILED" || paymentStatus == "CANCELLED" || paymentStatus == "EXPIRED") {
        return h(Badge, { class: "bg-red-500 " }, row.getValue("paymentStatus"));
      } else if (paymentStatus == "PENDING") {
        return h(Badge, { class: "bg-yellow-500 " }, row.getValue("paymentStatus"));
      } else if (paymentStatus == "REFUNDED") {
        return h(Badge, { class: "bg-blue-500 " }, row.getValue("paymentStatus"));
      } else if (paymentStatus == "NONE") {
        return h(Badge, row.getValue("paymentStatus"));
      } else {
        return h("div", { class: "" }, row.getValue("paymentStatus"));
      }
    },
  },
  {
    accessorKey: "completedDate",
    header: "Completed Date",
    cell: ({ row }) => {
      const completedDate = row.original.completedDate;
      return completedDate
        ? h(
            "div",
            {
              class: "whitespace-nowrap truncate hover:w-full font-medium",
            },
            new Date(row.getValue("completedDate")).toLocaleDateString()
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
        h(MerchantsBranchesDataTableRowActionsVue, {
          row,
          refetch,
        })
      );
    },
  },
];
