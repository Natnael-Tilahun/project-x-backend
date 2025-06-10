import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import ServiceDefinitionsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ServiceDefinition } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<ServiceDefinition>[] => [
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
      const serviceDefinitionId = row.original.id;
      const route = useRoute();
      const name = row.getValue("name");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${serviceDefinitionId}`,
            },
            row.getValue("name")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "serviceType",
    header: "Service Type",
    cell: ({ row }) => {
      const serviceType = row.getValue("serviceType");
      return serviceType
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("serviceType")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("description")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "defaultGroup",
    header: "Default Group",
    cell: ({ row }) => {
      const defaultGroup = row.getValue("defaultGroup");
      return defaultGroup
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("defaultGroup")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "numberOfFeatures",
    header: "Number of Features",
    cell: ({ row }) => {
      const numberOfFeatures = row.getValue("numberOfFeatures");
      return numberOfFeatures
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("numberOfFeatures")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "numberOfActiveRoles",
    header: "Number of Active Roles",
    cell: ({ row }) => {
      const numberOfActiveRoles = row.getValue("numberOfActiveRoles");
      return numberOfActiveRoles
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("numberOfActiveRoles")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "numberOfRoles",
    header: "Number of Roles",
    cell: ({ row }) => {
      const numberOfRoles = row.getValue("numberOfRoles");
      return numberOfRoles
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("numberOfRoles")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "numberOfContracts",
    header: "Number of Contracts",
    cell: ({ row }) => {
      const numberOfContracts = row.getValue("numberOfContracts");
      return numberOfContracts
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("numberOfContracts")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status
        ? h(
            Badge,
            {
              class:
                `max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium ${status == "ACTIVE" ? "bg-green-500": "bg-red-500"}`,
            },
            row.getValue("status")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => {
      const service = row.getValue("service")?.id;
      return service
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/bankingServices/${service}`,
            },
            "View Service Details"
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
        h(ServiceDefinitionsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
