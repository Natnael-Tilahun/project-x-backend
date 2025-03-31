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
      return firstname
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${staffId}`,
            },
            row.getValue("firstname") + " " + row.getValue("lastname")
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
    accessorKey: "externalId",
    header: "External Id",
    cell: ({ row }) => {
      const externalId = row.getValue("externalId");
      return externalId ? h("p", externalId) : h("p", "-");
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
    accessorKey: "loanOfficer",
    header: "Loan Officer",
    cell: ({ row }) => {
      const loanOfficer = row.getValue("loanOfficer");
      return loanOfficer ? h("p", loanOfficer) : h("p", "-");
    },
  },
  {
    accessorKey: "organisationalRoleType",
    header: "Organisational Role Type",
    cell: ({ row }) => {
      const organisationalRoleType = row.getValue("organisationalRoleType");
      return organisationalRoleType
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("organisationalRoleType")
          )
        : h("p", "-");
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
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("joiningDate")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "office",
    header: "Office",
    cell: ({ row }) => {
      const office = row.getValue("office")?.name
      return office
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("office")?.name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "organisationalRoleParentStaff",
    header: "Organisational Role Parent Staff",
    cell: ({ row }) => {
      const organisationalRoleParentStaff = row.getValue("organisationalRoleParentStaff");
      return organisationalRoleParentStaff
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("organisationalRoleParentStaff")?.firstname + " " + row.getValue("organisationalRoleParentStaff")?.lastname
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
