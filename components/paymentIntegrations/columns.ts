import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import PaymentIntegrationsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { PaymentIntegration } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<PaymentIntegration>[] => [
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
    accessorKey: "integrationName",
    header: "Integration Name",
    cell: ({ row }) => {
      const route = useRoute();
      const integrationName = row.getValue("integrationName");
      return integrationName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${row.original.id}`,
            },
            integrationName
          )
        : h("p", "-");
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
    accessorKey: "integrationType",
    header: "Integration Type",
    cell: ({ row }) => {
      const integrationType = row.getValue("integrationType");
      return integrationType ? h("p", integrationType) : h("p", "-");
    },
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => {
      const visibility = row.getValue("visibility");
      return visibility ? h("p", visibility) : h("p", "-");
    },
  },
  {
    accessorKey: "singleFormPayment",
    header: "Single Form Payment",
    cell: ({ row }) => {
      const singleFormPayment = row.getValue("singleFormPayment");
      return singleFormPayment ? h("p", "Yes") : h("p", "No");
    },
  },
  {
    accessorKey: "isDraft",
    header: "Draft",
    cell: ({ row }) => {
      const isDraft = row.getValue("isDraft");
      return isDraft ? h("p", "Yes") : h("p", "No");
    },
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled");
      return enabled ? h("p", "Yes") : h("p", "No");
    },
  },
  {
    accessorKey: "confirmRecipientIdentity",
    header: "Confirm Recipient Identity",
    cell: ({ row }) => {
      const confirmRecipientIdentity = row.getValue("confirmRecipientIdentity");
      return confirmRecipientIdentity ? h("p", "Yes") : h("p", "No");
    },
  },
  {
    accessorKey: "reEnquirePaymentDetailBeforePayment",
    header: "Re-Enquire Payment Detail Before Payment",
    cell: ({ row }) => {
      const reEnquirePaymentDetailBeforePayment = row.getValue(
        "reEnquirePaymentDetailBeforePayment"
      );
      return reEnquirePaymentDetailBeforePayment ? h("p", "Yes") : h("p", "No");
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
        h(PaymentIntegrationsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
