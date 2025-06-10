import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import ApplicationDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Application } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Application>[] => [
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
    header: "Application Name",
    cell: ({ row }) => {
      const route = useRoute();
      const applicationName = row.getValue("name");
      const applicationId = row.original.id;
      return applicationName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${applicationId}`,
            },
            applicationName
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Application Description",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "downloadUrl",
    header: "Download URL",
  },
  {
    accessorKey: "bundleId",
    header: "Bundle ID",
  },
  {
    accessorKey: "appStoreId",
    header: "App Store ID",
  },
  {
    accessorKey: "enabled",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("enabled");
      if (status) {
        return h(Badge, { class: "bg-green-600  " }, "Enabled");
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
        h(ApplicationDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
