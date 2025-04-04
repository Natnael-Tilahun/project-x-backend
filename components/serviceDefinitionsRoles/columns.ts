import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import ServiceDefinitionsRolesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ServiceDefinitionRole } from "~/types";

export const columns: ColumnDef<ServiceDefinitionRole>[] = [
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
    header: "Info",
    cell: ({ row }) => {
      const serviceDefinitionRoleId = row.original.id;
      const serviceDefinitionId = row.original.serviceDefinition.id;
      const route = useRoute();
      return serviceDefinitionRoleId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=serviceDefinitionRoleDetails&serviceDefinitionRoleId=${serviceDefinitionRoleId}`,
            },
            "View Details"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "service",
    header: "Service Definition",
    cell: ({ row }) => {
      const serviceDefinitionId = row.original.id;
      const route = useRoute();
      const name = row.getValue("serviceDefinition")?.name;
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${serviceDefinitionId}`,
            },
            row.getValue("serviceDefinition")?.name
          )
        : h(NuxtLink, {
            class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
            to: `${route.path}?activeTab=serviceDefinitionDetails&serviceDefinitionId=${serviceDefinitionId}`,
          }, "View Service Definition Details");
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const route = useRoute();
      const name = row.getValue("role")?.name;
      return name
        ? h(
            NuxtLink,
            {
              class:
              "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/userRoles/${name}`,
            },
            row.getValue("role")?.name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "isDefault",
    header: "Is Default",
    cell: ({ row }) => {
      const isDefault = row.getValue("isDefault");
      return isDefault
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("isDefault")
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
        h(ServiceDefinitionsRolesDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
