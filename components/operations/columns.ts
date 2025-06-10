import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import OperationsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import { h, inject } from "vue"; // Import inject
import type { ApiOperation } from "~/types";


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<ApiOperation>[] => [
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
    accessorKey: "operationName",
    header: "Operation Name",
    cell: ({ row }) => {
      const route = useRoute();
      const operationName = row.getValue("operationName");
      return operationName ? h(NuxtLink, {  class: "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full", to: `${route.path}?activeTab=configureOperations&operationId=${row.original.id}` }, operationName) : h("p", "-");
    },
  },
  {
    accessorKey: "httpMethod",
    header: "HTTP Method",
    cell: ({ row }) => {
      const httpMethod = row.getValue("httpMethod");
      return httpMethod ? h("p", httpMethod) : h("p", "-");
    },
  },
  {
    accessorKey: "endpointPath",
    header: "Endpoint Path",
    cell: ({ row }) => {
      const endpointPath = row.getValue("endpointPath");
      return endpointPath ? h("p", endpointPath) : h("p", "-");
    },
  },
  {
    accessorKey: "apiIntegration",
    header: "API Integration",
    cell: ({ row }) => {
      const apiIntegration = row.getValue("apiIntegration");
      return apiIntegration ? h("p", apiIntegration?.name) : h("p", "-");
    },
  },
  {
    accessorKey: "responseOutputs",
    header: "Response Outputs",
    cell: ({ row }) => {
      const responseOutputs = row.getValue("responseOutputs");
      return responseOutputs ? h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
        row.getValue("responseOutputs")?.length
      ) : h("p", "-");
    },
  },
  {
    accessorKey: "requestInputs",
    header: "Request Inputs",
    cell: ({ row }) => {
      const requestInputs = row.getValue("requestInputs");
      return requestInputs ? h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
        row.getValue("requestInputs")?.length
      ) : h("p", "-");
    },
  },
  {
    accessorKey: "integrationOperations",
    header: "Integration Operations",
    cell: ({ row }) => {
      const integrationOperations = row.getValue("integrationOperations");
      return integrationOperations ? h("p", integrationOperations) : h("p", "-");
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
        h(OperationsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
