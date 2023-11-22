import type { ColumnDef } from "@tanstack/vue-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-vue-next";
import { Checkbox } from "../ui/checkbox";
import DataTableRowActionsVue from "../DataTableRowActions.vue";
import DataTableColumnHeaderVue from "../DataTableColumnHeader.vue";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  status: string;
}

export const columns: ColumnDef<User>[] = [
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
  },
  {
    accessorKey: "fullName",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Full Name" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[180px] whitespace-nowrap truncate font-medium" },
        row.getValue("fullName")
      );
    },
  },
  {
    accessorKey: "userName",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "UserName" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate font-medium" },
        row.getValue("userName")
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Email" }),

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "lowercase max-w-[210px] truncate '",
        },
        row.getValue("email")
      ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("role")),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
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
