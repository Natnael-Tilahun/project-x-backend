import type { ColumnDef } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UsersDataTableRowActionsVue from "./DataTableRowActions.vue";
// import { Badge } from "../ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  status:
  | "Active"
  | "processing"
  | "Suspended"
  | "Locked"
  | "New"
  | "UnEnrolled";
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
    cell: ({ row }) => {
      const id = row.getValue("id");
      return h(
        "div",
        {
          class:
            "overflow-hidden text-ellipsis whitespace-nowrap w-24  transition-all duration-400 ease-out hover:w-full",
        },
        row.getValue("id")
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Phone" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap  font-medium" },
        row.getValue("phone")
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
          class: "lowercase max-w-[210px] truncate hover:w-full'",
        },
        row.getValue("email")
      ),
  },
  {
    accessorKey: "authorities",
    header: "Role",
    cell: ({ row }) => {
      let roles = row.getValue("authorities");
      return roles.map((role, index) => {
        const comma = index < roles.length - 1 ? "," : ""; // Add comma if not the last role
        return h("p", { class: "lowercase" }, [role, comma]);
      });
    },
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Created By" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[180px] whitespace-nowrap truncate font-medium" },
        row.getValue("createdBy")
      );
    },
  },
  {
    accessorKey: "enrolled",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Enrolled" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate font-medium" },
        row.getValue("enrolled")
      );
    },
  },
  {
    accessorKey: "activated",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("activated");
      if (status) {
        return h(Badge, { class: "bg-green-600 " }, "Active");
      } else {
        return h(Badge, { class: "bg-red-500 whitespace-nowrap" }, "In Active");
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
        h(UsersDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
