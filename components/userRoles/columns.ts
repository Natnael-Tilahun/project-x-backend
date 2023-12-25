import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UserRolesDataTableRowActionsVue from "./DataTableRowActions.vue";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface UserRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  legalEntity: [string] | string;
  status: "New" | "Active" | "Suspended" | "Deactivated";
  systemPermissions: [{}];
  customerAccess: [{}];
}

export const columns: ColumnDef<UserRole>[] = [
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
    accessorKey: "roleName",
    header: "Roll Name",
  },
  {
    accessorKey: "roleDescription",
    header: "Role Description",
  },
  {
    accessorKey: "legalEntity",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Legal Entity" }),

    cell: ({ row }) => row.getValue("legalEntity"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "Active") {
        return h(Badge, { class: "bg-green-600 " }, row.getValue("status"));
      } else if (status == "New") {
        return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
      } else if (status == "Deactivated") {
        return h(Badge, { class: "bg-red-500 " }, row.getValue("status"));
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
        h(UserRolesDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
