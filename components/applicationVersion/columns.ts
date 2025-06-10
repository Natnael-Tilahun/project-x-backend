import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import ApplicationVersionDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import { h, inject } from "vue"; // Import inject
import type { AppVersion } from "~/types";

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<AppVersion>[] => [
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
    accessorKey: "versionName",
    header: "Application Version Name",
    cell: ({ row }) => {
      const route = useRoute();
      const applicationVersionName = row.getValue("versionName");
      const applicationVersionId = row.original.id;
      return applicationVersionName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=applicationVersionDetails&applicationVersionId=${applicationVersionId}`,
            },
            applicationVersionName
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "versionNumber",
    header: "Application Version Number",
  },
  {
    accessorKey: "buildNumber",
    header: "Build Number",
  },
  {
    accessorKey: "minRequiredVersion",
    header: "Minimum Required Version",
  },
  {
    accessorKey: "apiKeyHash",
    header: "API Key Hash",
  },
  {
    accessorKey: "allowedChecksum",
    header: "Allowed Checksum",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      const status = row.getValue("enabled");
      if (status) {
        return h(Badge, { class: "bg-green-600  " }, "Enabled");
      } else return h(Badge, { class: "bg-red-500 " }, "Disabled");
    },
  },
  {
    accessorKey: "isRevoked",
    header: "Revoked",
    cell: ({ row }) => {
      const status = row.getValue("isRevoked");
      return status ? h("p", "True") : h("p", "False");
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
        h(ApplicationVersionDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
