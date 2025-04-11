import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UssdLanguagesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { UssdLanguage } from "~/types";

export const columns: ColumnDef<UssdLanguage>[] = [
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
    accessorKey: "languageName",
    header: "Name",
    cell: ({ row }) => {
      const route = useRoute();
      const name = row.getValue("languageName");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${row.original.id}`,
            },
            row.getValue("languageName")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "languageType",
    header: "Language Type",
    cell: ({ row }) => {
      const languageType = row.getValue("languageType");
      return languageType ? h("p", languageType) : h("p", "-");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "Visible") {
        return h(Badge, { class: "bg-green-600 " }, row.getValue("status"));
      } else {
        return h(Badge, { class: "bg-red-500 whitespace-nowrap" }, row.getValue("status"));
      }
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
        h(UssdLanguagesDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
