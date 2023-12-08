import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableRowActionsVue from "../DataTableRowActions.vue";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface CustomerEnroll {
  customerId: string;
  customerName: string;
  // service:
  //   | "Retail Online Banking"
  //   | "Corporate Online banking"
  //   | "Wealth Online Banking"
  //   | "Retail and Wealth Online Banking"
  //   | "SME Online Banking";
  // roll: "Administrator" | "Authorizer" | "Creator" | "Viewer";
  // status:
  //   | "Active"
  //   | "processing"
  //   | "Suspended"
  //   | "Locked"
  //   | "New"
  //   | "UnEnrolled";
}

export const columns: ColumnDef<CustomerEnroll>[] = [
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
    accessorKey: "customerId",
    header: "Customer Id",
  },
  { accessorKey: "customerName", header: "Customer Name" },
  { accessorKey: "service", header: "Service " },
  { accessorKey: "roll", header: "Roll" },
  // {
  //   accessorKey: "service",
  //   header: ({ column }) =>
  //     h(DataTableColumnHeaderVue, { column, title: "Service" }),

  //   cell: ({ row }) =>
  //     h(
  //       Select,
  //       {
  //         class: "lowercase max-w-[210px] truncate '",
  //       },
  //       h(SelectItem, row.getValue("service"))
  //     ),
  // },
  // {
  //   accessorKey: "roll",
  //   header: ({ column }) =>
  //     h(DataTableColumnHeaderVue, { column, title: "roll" }),

  //   cell: ({ row }) =>
  //     h(
  //       Select,
  //       {
  //         class: "lowercase max-w-[210px] truncate ",
  //       },
  //       h(SelectItem, row.getValue("roll"))
  //     ),
  // },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(DataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
