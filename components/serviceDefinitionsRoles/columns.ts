import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import ServiceDefinitionsRolesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ServiceDefinitionRole } from "~/types";
import Badge from "../ui/badge/Badge.vue";

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
    accessorKey: "roleName",
    header: "Role Name",
    cell: ({ row }) => {
      const serviceDefinitionRoleId = row.original.id;
      const roleName = row.original.serviceDefinition.roleName;
      const route = useRoute();
      return roleName
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
    accessorKey: "roleDescription",
    header: "Role Description",
    cell: ({ row }) => {
      const serviceDefinitionRoleId = row.original.id;
      const roleDescription = row.original.serviceDefinition.roleDescription;
      const route = useRoute();
      return roleDescription
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
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions	 = row.original.permissions
   return h(
            "div",
            {
              class:
              "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
            },
           permissions?.length
          )
       
    },
  },
  {
    accessorKey: "isDefault",
    header: "Is Default",
    cell: ({ row }) => {
      const isDefault = row.getValue("isDefault");
      return h(
            Badge,
            {
              class:
                `max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium ${isDefault ? "bg-green-500": "bg-red-500"}`,
            },
            row.getValue("isDefault")
          )
        
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
