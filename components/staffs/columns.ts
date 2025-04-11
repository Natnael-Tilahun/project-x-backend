import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import StaffsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Staff } from "~/types";
export const columns: ColumnDef<Staff>[] = [
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
    accessorKey: "firstname",
    header: "Full Name",
    cell: ({ row }) => {
      const staffId = row.original.id;
      const route = useRoute();
      const firstname = row.getValue("firstname");
      const lastname = row.original.lastname;
      return firstname
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${staffId}`,
            },
            row.getValue("firstname") + " " + lastname
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "displayName",
    header: "Display Name",
    cell: ({ row }) => {
      const displayName = row.getValue("displayName");
      return displayName
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("displayName")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "mobileNo",
    header: "Phone Number",
    cell: ({ row }) => {
      const mobileNo = row.getValue("mobileNo");
      return mobileNo
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("mobileNo")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "emailAddress",
    header: "Email Address",
    cell: ({ row }) => {
      const emailAddress = row.getValue("emailAddress");
      return emailAddress ? h("p", emailAddress) : h("p", "-");
    },
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const active = row.getValue("active");
      return active
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("active")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "joiningDate",
    header: "Joining Date",
    cell: ({ row }) => {
      const joiningDate = row.getValue("joiningDate");
      return joiningDate
        ? h(
            "div",
            {
              class:
                "whitespace-nowrap truncate hover:w-full font-medium",
            },
            new Date(row.getValue("joiningDate")).toDateString()
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const userId = row.original.user?.id;
      const route = useRoute();
      return userId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${userId}`,
            },
            row.getValue("user")?.phone
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
        h(StaffsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
