import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import MerchantsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Merchant } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Merchant>[] => [
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
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => {
      const merchantId = row.original.merchantId;
      const route = useRoute();
      const businessName = row.getValue("businessName");
      return businessName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${merchantId}`,
            },
            row.getValue("businessName")
          )
        : h(
          NuxtLink,
          {
            class:
              "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
            to: `${route.path}/${merchantId}`,
          },
          "View Merchant Details"
        );
    },
  },
  {
    accessorKey: "businessNumber",
    header: "Business Number",
    cell: ({ row }) => {
      const businessNumber = row.getValue("businessNumber");
      return businessNumber
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("businessNumber")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "businessPhoneNumber",
    header: "Business Phone Number",
    cell: ({ row }) => {
      const businessPhoneNumber = row.getValue("businessPhoneNumber");
      return businessPhoneNumber
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("businessPhoneNumber")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => {
      const city = row.getValue("city");
      return city ? h("p", city) : h("p", "-");
    },
  },
  {
    accessorKey: "businessEmail",
    header: "Business Email",
    cell: ({ row }) => {
      const businessEmail = row.getValue("businessEmail");
      return businessEmail ? h("p", businessEmail) : h("p", "-");
    },
  },
  {
    accessorKey: "postalNumber",
    header: "Postal Number",
    cell: ({ row }) => {
      const postalNumber = row.getValue("postalNumber");
      return postalNumber ? h("p", postalNumber) : h("p", "-");
    },
  },
  {
    accessorKey: "tradeLicenseNumber",
    header: "Trade License Number",
    cell: ({ row }) => {
      const tradeLicenseNumber = row.getValue("tradeLicenseNumber");
      return tradeLicenseNumber
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("tradeLicenseNumber")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "taxPayerIdNumber",
    header: "Tax Payer Id Number",
    cell: ({ row }) => {
      const taxPayerIdNumber = row.getValue("taxPayerIdNumber");
      return taxPayerIdNumber
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("taxPayerIdNumber")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "shortCode",
    header: "Short Code",
    cell: ({ row }) => {
      const shortCode = row.getValue("shortCode");
      return shortCode ? h("p", shortCode) : h("p", "-");
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status");
  //     return status ? h(Badge, status) : h(Badge, "-");
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "ACTIVATED") {
        return h(Badge, { class: "bg-green-600 " }, row.getValue("status"));
      } else if (status == "New") {
        return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
      } else if (status == "BLOCKED") {
        return h(Badge, { class: "bg-red-500 " }, row.getValue("status"));
      } else if (status == "PENDING") {
        return h(Badge, { class: "bg-yellow-500 " }, row.getValue("status"));
      } else if (status == "INACTIVE") {
        return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
      } else if (status == "DEACTIVATED") {
        return h(Badge, { class: "bg-orange-700 " }, row.getValue("status"));
      } else {
        return h("div", { class: "" }, row.getValue("status"));
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
        h(MerchantsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
