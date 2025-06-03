import type { ColumnDef } from "@tanstack/vue-table";
import { h, inject } from "vue"; // Import inject

import { Checkbox } from "../ui/checkbox";
// import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue"; // Not used in snippet
import { Badge } from "../ui/badge";
import UssdLanguagesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { UssdLanguage } from "~/types";

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<UssdLanguage>[] => [
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
      // const route = useRoute(); // useRoute should be fine here if Nuxt auto-imports it
      const name = row.getValue("languageName");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/ussdLanguages/${row.original.id}`, // Simplified path construction
            },
            () => row.getValue("languageName") // Content as a render function
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "languageType",
    header: "Language Type",
    cell: ({ row }) => {
      const languageType = row.getValue("languageType");
      return languageType ? h("p", String(languageType)) : h("p", "-"); // Ensure string
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "Visible") {
        return h(Badge, { class: "bg-green-600 " }, () => String(status)); // Content as a render function
      } else {
        return h(Badge, { class: "bg-red-500 whitespace-nowrap" }, () => String(status)); // Content as a render function
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
          refetch,
        })
      );
    },
  },
];