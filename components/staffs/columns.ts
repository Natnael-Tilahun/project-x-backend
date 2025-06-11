import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import StaffsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Staff } from "~/types";
import { h, inject } from "vue"; // Import inject


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<Staff>[] => [
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
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const username = row.getValue("username");
      return username
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("username")
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
      if (active) {
        return h(Badge, { class: " bg-green-600 " }, "Active");
      } else return h(Badge, { class: "bg-red-500 " }, "Inactive");
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
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(StaffsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
