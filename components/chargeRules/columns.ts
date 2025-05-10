import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import ChargeRuleDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";

export const columns: ColumnDef<ApplicationVersion>[] = [
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
      const chargeRuleId = row.original.id;
      return id
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=chargeRuleDetails&chargeRuleId=${chargeRuleId}`,
            },
            "View Details"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "ruleType",
    header: "Rule Type",
  },
  {
    accessorKey: "amountRangeStart",
    header: "Amount Range Start",
  },
  {
    accessorKey: "amountRangeEnd",
    header: "Amount Range End",
  },
  {
    accessorKey: "fixedAmount",
    header: "Fixed Amount",
  },
  {
    accessorKey: "percentage",
    header: "Percentage",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(ChargeRuleDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
