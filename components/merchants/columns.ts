import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import MerchantsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";

export const columns: ColumnDef<Merchant>[] = [
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
            businessName
          )
        : h("p", "-");
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
    accessorKey: "faxNumber",
    header: "Fax Number",
    cell: ({ row }) => {
      const faxNumber = row.getValue("faxNumber");
      return faxNumber
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("faxNumber")
          )
        : h("p", "-");
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
    accessorKey: "tradeLicenseExpiryDate",
    header: "Trade License Expiry Date",
    cell: ({ row }) => {
      const tradeLicenseExpiryDate = row.getValue("tradeLicenseExpiryDate");
      return tradeLicenseExpiryDate
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("tradeLicenseExpiryDate")
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
    accessorKey: "taxPayerIssueDate",
    header: "Tax Payer Issue Date",
    cell: ({ row }) => {
      const taxPayerIssueDate = row.getValue("taxPayerIssueDate");
      return taxPayerIssueDate
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("taxPayerIssueDate")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "taxPayerExpiryDate",
    header: "Tax Payer Expiry Date",
    cell: ({ row }) => {
      const taxPayerExpiryDate = row.getValue("taxPayerExpiryDate");
      return taxPayerExpiryDate
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("taxPayerExpiryDate")
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status ? h("p", status) : h("p", "-");
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status");
  //     if (status == "Active") {
  //       return h(Badge, { class: "bg-green-600 " }, row.getValue("status"));
  //     } else if (status == "New") {
  //       return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
  //     } else if (status == "Locked") {
  //       return h(Badge, { class: "bg-red-500 " }, row.getValue("status"));
  //     } else if (status == "processing") {
  //       return h(Badge, { class: "bg-yellow-500 " }, row.getValue("status"));
  //     } else if (status == "UnEnrolled") {
  //       return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
  //     } else if (status == "Suspended") {
  //       return h(Badge, { class: "bg-orange-700 " }, row.getValue("status"));
  //     } else {
  //       return h("div", { class: "" }, row.getValue("status"));
  //     }
  //   },
  // },
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
        })
      );
    },
  },
];
