import type { ColumnDef } from "@tanstack/vue-table";
import { h, inject } from "vue"; // Import inject
import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UssdLocalizedMenusDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { LocalizedUssdMenu } from "~/types";

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<LocalizedUssdMenu>[] => [
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
    header: "Id",
    cell: ({ row }) => {
      const route = useRoute();
      const id = row.getValue("id");
      return id
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${row.original.id}`,
            },
            "View Menu Details"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "message",
    header: "Menu Message",
    cell: ({ row }) => {
      const menuName = row.getValue("message");
      return menuName ? h("p", row.getValue("message")) : h("p", "-");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "Visible") {
        return h(Badge, { class: "bg-green-600 " }, row.original.status);
      } else {
        return h(
          Badge,
          { class: "bg-red-500 whitespace-nowrap" },
          row.original.status
        );
      }
    },
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => {
      const language = row.original.language;
      return language
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/ussdLanguages/${language.id}`,
            },
            row.original.language.languageName
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "defaultMenu",
    header: "Default Menu",
    cell: ({ row }) => {
      const menuLanguage = row.original.defaultMenu.id;
      return menuLanguage
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/ussdMenus/${menuLanguage}`,
            },
            row.original.defaultMenu.message
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
        h(UssdLocalizedMenusDataTableRowActionsVue, {
          row,
          refetch,
        })
      );
    },
  },
];
