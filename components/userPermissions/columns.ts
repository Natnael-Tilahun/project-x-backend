import { Checkbox } from "../ui/checkbox";
import type { ColumnDef } from "@tanstack/vue-table";
import UserPermissionsDataTableRowActionsVue from "./DataTableRowActions.vue";
import type { Permission } from "~/types";
import { NuxtLink } from "#components";
import Badge from "../ui/badge/Badge.vue";

export const columns: ColumnDef<Permission>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(
        Checkbox,

        {
          checked: table.getIsAllPageRowsSelected(),
          "onUpdate:checked": (value: boolean) =>
            table.toggleAllPageRowsSelected(!!value),
          ariaLabel: "Select all",
        }
      ),
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
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const route = useRoute();
      const code = row.getValue("code");
      return code
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${code}`,
            },
            row.getValue("code")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "entityName",
    header: "Name",
    cell: ({ row }) => {
      const entityName = row.getValue("entityName");
      if (entityName) {
        return h("p", entityName);
      } else
        return h("p", "None");

    },
  },
  {
    accessorKey: "description",
    header: "Permission Description",
  },
  {
    accessorKey: "grouping",
    header: "Grouping",
  },
  {
    accessorKey: "scope",
    header: "Scope",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "actionName",
    header: "Action Name",
    cell: ({ row }) => {
      const actionName = row.getValue("actionName");
      if (actionName) {
        return h("p", actionName);
      } else
        return h("p", "None");

    },
  },
  {
    accessorKey: "entityName",
    header: "Entity Name",
    cell: ({ row }) => {
      const entityName = row.getValue("entityName");
      if (entityName) {
        return h("p", entityName);
      } else
        return h("p", "None");

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
        h(UserPermissionsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
