import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import AccountCategoriesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { AccountCategory } from "~/types";
import { h, inject } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<AccountCategory>[] => [
// export const columns: ColumnDef<BankingService>[] = [
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
    accessorKey: "categoryCode",
    header: "Category   ",
    cell: ({ row }) => {
      const categoryCode = row.original.categoryCode;
      const route = useRoute();
      const name = row.getValue("categoryCode");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${categoryCode}`,
            },
            row.getValue("categoryCode")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
    cell: ({ row }) => {
      const shortName = row.original.shortName;
      const route = useRoute();
      const name = row.getValue("shortName");
      return name
        ? h(
          "div",
          {
            class:
              "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
          },
          row.getValue("shortName")
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
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(AccountCategoriesDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
