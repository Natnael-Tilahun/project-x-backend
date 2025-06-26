import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import ServiceDefinitionsRolesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { ServiceDefinitionRole } from "~/types";
import Badge from "../ui/badge/Badge.vue";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<ServiceDefinitionRole>[] => [
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
    accessorKey: "roleName",
    header: "Role Name",
    cell: ({ row }) => {
      const serviceDefinitionRoleId = row.original.id;
      const roleName = row.original.roleName;
      const route = useRoute();
      return h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=serviceDefinitionRoleDetails&serviceDefinitionRoleId=${serviceDefinitionRoleId}`,
            },
            roleName || "View Role Details")
    },
  },
  {
    accessorKey: "roleDescription",
    header: "Role Description",
    cell: ({ row }) => {
      const serviceDefinitionRoleId = row.original.id;
      const roleDescription = row.original.roleDescription;
      const route = useRoute();
      return roleDescription
        ?  h(
          "div",
          {
            class:
            "w-fit whitespace-nowrap truncate hover:w-full",
          },
          roleDescription
        )
        : h("p", "-");
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
            row.getValue("isDefault") ?? "false"
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
          refetch
        })
      );
    },
  },
];
