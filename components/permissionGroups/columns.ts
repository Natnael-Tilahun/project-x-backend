import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import PermissionGroupsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { PermissionGroup } from "~/types";
import { PermissionGroupStatus } from "@/global-types";
import { h } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<PermissionGroup>[] => [
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
    accessorKey: "groupCode",
    header: "Group Code",
    cell: ({ row }) => {
        const permissionGroupId = row.original.groupCode;
      const route = useRoute();
      const name = row.getValue("groupCode");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${permissionGroupId}`,
            },
            row.getValue("groupCode")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "name",
    header: "Group Name",
    cell: ({ row }) => {
      const groupName = row.getValue("name");
      return groupName
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("name")
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
    accessorKey: "scope",
    header: "Scope",
    cell: ({ row }) => {
      const scope = row.getValue("scope");
      return scope
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("scope")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status === PermissionGroupStatus.ACTIVE) {
        return h(Badge, { class: "bg-green-600 " }, status);
      } else return h(Badge, { class: "bg-red-500  " }, row.getValue("status"));
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
        h(PermissionGroupsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
