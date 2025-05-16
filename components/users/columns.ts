import type { ColumnDef } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UsersDataTableRowActionsVue from "./DataTableRowActions.vue";
import type { User } from "~/types";
import { NuxtLink } from "#components";
// import { Badge } from "../ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export interface User {
//   id: string;
//   fullName: string;
//   userName: string;
//   email: string;
//   role: string;
//   status:
//   | "Active"
//   | "processing"
//   | "Suspended"
//   | "Locked"
//   | "New"
//   | "UnEnrolled";
// }

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
    accessorKey: "login",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Username" }),
    cell: ({ row }) => {
      const id = row.original.id;
      const route = useRoute();
      return h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${id}`,
          },
          row.getValue("login")
        );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Phone" }),
    cell: ({ row }) => {
      const phone = row.getValue("phone");
      return phone ?
      h(
        "div",
        {
          class: "lowercase max-w-[210px] truncate hover:w-full'",
        },
        row.getValue("phone")
      ) : h("div", { class: "lowercase max-w-[210px] truncate hover:w-full'" }, "-");
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Email" }),

    cell: ({ row }) => {
      const email = row.getValue("email");
      return email ?
      h(
        "div",
        {
          class: "lowercase max-w-[210px] truncate hover:w-full'",
        },
        row.getValue("email")
      ) : h("div", { class: "lowercase max-w-[210px] truncate hover:w-full'" }, "-");
    },
  },
  {
    accessorKey: "authorities",
    header: "Role",
    cell: ({ row }) => {
      let roles = row.getValue("authorities");
      return (roles && roles?.length > 0) ? roles?.map((role: string, index: number) => {
        const comma = index < roles?.length - 1 ? "," : ""; // Add comma if not the last role
        return h("p", { class: "lowercase" }, [role, comma]);
      }) : h("div", { class: "lowercase max-w-[210px] truncate hover:w-full'" }, "-");
    },
  },
  {
    accessorKey: "verified",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Verified" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate font-medium" },
        row.getValue("verified")
      );
    },
  },
  {
    accessorKey: "forcePinChange",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Force Pin Change" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate font-medium" },
        row.getValue("forcePinChange")
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Email Verified" }),
    cell: ({ row }) => {
      return h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate font-medium" },
        row.getValue("emailVerified")
      );
    },
  },
  {
    accessorKey: "staff",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Staff" }),
    cell: ({ row }) => {
      return h(
        "div",
        row.getValue("staff")
      );
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Customer" }),
    cell: ({ row }) => {
      return h(
        "div",
        row.getValue("customer")
      );
    },
  },
  {
    accessorKey: "operator",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "Operator" }),
    cell: ({ row }) => {
      return h(
        "div",
        row.getValue("operator")
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
