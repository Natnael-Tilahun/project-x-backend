import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import UserRolesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Role } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Role>[] => [
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => {
      const route = useRoute();
      const roleName = row.getValue("name");
      return roleName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${roleName}`,
            },
            row.getValue("name")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Role Description",
  },
  {
    accessorKey: "enforce2fa",
    header: "Enforce 2fa",
    cell: ({ row }) => {
      const enforce = row.getValue("enforce2fa");
      if (enforce) {
        return h("p", "True");
      } else return h("p", "False");
    },
  },
  {
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }) => {
      const scope = row.getValue("scope");
      if (scope) {
        return h("p", scope);
      } else return h("p", "None");
    },
  },
  {
    accessorKey: "enabled",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("enabled");
      if (status) {
        return h(Badge, { class: " bg-green-600 " }, "Enabled");
      } else return h(Badge, { class: "bg-red-500 " }, "Disabled");
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
        h(UserRolesDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
