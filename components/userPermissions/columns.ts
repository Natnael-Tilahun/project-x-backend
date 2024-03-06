import { Checkbox } from "../ui/checkbox";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UserPermissionsDataTableRowActionsVue from "./DataTableRowActions.vue";

export interface UserPermission {
  permissionId: string;
  permissionName: string;
  permissionDescription: string;
  legalEntity: [string] | string;
  status: "New" | "Active" | "Suspended" | "Deactivated";
  grouping: string;
}

export const columns: ColumnDef<UserPermission>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(
        Checkbox,

        {
          checked: table.getIsAllPageRowsSelected(),
          "onUpdate:checked": (value: boolean) =>
            table.toggleAllPageRowsSelected(!!value),
          ariaLabel: "Select all",
        }
      ),
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
    accessorKey: "permissionName",
    header: "Permission Name",
  },
  {
    accessorKey: "permissionDescription",
    header: "Permission Description",
  },
  {
    accessorKey: "grouping",
    header: "Grouping",
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
        h(UserPermissionsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
