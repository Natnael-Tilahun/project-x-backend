import type { ColumnDef } from "@tanstack/vue-table";
import { h, inject } from "vue"; // Import inject
import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UssdLocalizedMessagesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { LocalizedDefaultMessage } from "~/types";

type RefetchFunction = () => Promise<void>;

export const columns= (refetch: RefetchFunction): ColumnDef<LocalizedDefaultMessage>[] => [
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
            "View Message Details"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message");
      return message ? h("p", message) : h("p", "-");
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
        return h(
          Badge,
          { class: "bg-red-500 whitespace-nowrap" },
          row.getValue("status")
        );
      }
    },
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => {
      const language = row.original.language.id;
      return language
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/ussdLanguages/${language}`,
            },
            row.original.language.languageName
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "defaultMessage",
    header: "Default Message",
    cell: ({ row }) => {
      const defaultMessageId = row.original.defaultMessage.id;
      return defaultMessageId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/ussdDefaultMessages/${defaultMessageId}`,
            },
            row.original.defaultMessage.message
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
        h(UssdLocalizedMessagesDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
