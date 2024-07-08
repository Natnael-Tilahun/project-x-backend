import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import IntegrationsDataTableRowActionsVue from "./DataTableRowActions.vue";

export const columns: ColumnDef<Integration>[] = [
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
      const id = row.getValue("id");
      return id ? h(
        "div",
        { class: "w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
        row.getValue("id")
      ) : h("p", "-");
    },
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => {
      const companyName = row.getValue("companyName");
      return companyName ? h("p", companyName) : h("p", "-");
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
    accessorKey: "integrationName",
    header: "integrationName",
    cell: ({ row }) => {
      const integrationName = row.getValue("integrationName");
      return integrationName ? h("p", integrationName) : h("p", "-");
    },
  },
  {
    accessorKey: "isDraft",
    header: "Is Draft",
    cell: ({ row }) => {
      const isDraft = row.getValue("isDraft");
      return isDraft ? h("p", isDraft) : h("p", "-");
    },
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled");
      return enabled ? h("p", enabled) : h("p", "-");
    },
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
    cell: ({ row }) => {
      const accountNumber = row.getValue("accountNumber");
      return accountNumber ? h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
        row.getValue("accountNumber")
      ) : h("p", "-");
    },
  },
  {
    accessorKey: "currencyCode",
    header: "Currency Code",
    cell: ({ row }) => {
      const currencyCode = row.getValue("currencyCode");
      return currencyCode ? h("p", currencyCode) : h("p", "-");
    },
  },
  {
    accessorKey: "integrationCategory",
    header: "Integration Category",
    cell: ({ row }) => {
      const integrationCategory = row.getValue("integrationCategory");
      return integrationCategory ? h("p", integrationCategory) : h("p", "-");
    },
  },
  {
    accessorKey: "visiblity", header: "Visiblity",
    cell: ({ row }) => {
      const visiblity = row.getValue("visiblity");
      return visiblity != null ? h("p", visiblity) : h("p", "-");
    },
  },
  {
    accessorKey: "confirmRecipientIdentity", header: "Confirm Recipient Identity",
    cell: ({ row }) => {
      const confirmRecipientIdentity = row.getValue("confirmRecipientIdentity");
      return confirmRecipientIdentity != null ? h("p", confirmRecipientIdentity) : h("p", "-");
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
        h(IntegrationsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
