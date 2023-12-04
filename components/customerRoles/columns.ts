import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../DataTableColumnHeader.vue";
import { Badge } from "../ui/badge";
import CustomerRolesDataTableRowActionsVue from "../CustomerRolesDataTableRowActions.vue";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface CustomerRole {
  rollName: string;
  rollType: string;
  businessType: [string, string] | string;
  customers: Number;
  status: "Active" | "Suspended" | "Deactivated";
}

export const columns: ColumnDef<CustomerRole>[] = [
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
    accessorKey: "rollName",
    header: "Roll Name",
  },
  {
    accessorKey: "businessType",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Business Type" }),

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-[240px] truncate '",
        },
        row.getValue("businessType")
      ),
  },
  { accessorKey: "customers", header: "Customers" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "Active") {
        return h(Badge, { class: "bg-green-600 " }, row.getValue("status"));
      } else if (status == "New") {
        return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
      } else if (status == "Locked") {
        return h(Badge, { class: "bg-red-500 " }, row.getValue("status"));
      } else if (status == "processing") {
        return h(Badge, { class: "bg-yellow-500 " }, row.getValue("status"));
      } else if (status == "UnEnrolled") {
        return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
      } else if (status == "Suspended") {
        return h(Badge, { class: "bg-orange-700 " }, row.getValue("status"));
      } else {
        return h("div", { class: "" }, row.getValue("status"));
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
        h(CustomerRolesDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
