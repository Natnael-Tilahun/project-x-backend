import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "~/components/ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import StaffAssignmentsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { StaffAssignment } from "~/types";
export const columns: ColumnDef<StaffAssignment>[] = [
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
    header: "Staff Assignment",
    cell: ({ row }) => {
      const staffAssignmentId = row.original?.id;
      const route = useRoute();
      return staffAssignmentId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/staffAssignments/${staffAssignmentId}`,
            },
            "View Details"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "staff",
    header: "Staff",
    cell: ({ row }) => {
      const staffId = row.original.staff?.id;
      const route = useRoute();
      return staffId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/staffs/${staffId}?activeTab=staffDetails`,
            },
            "View Staff"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "office",
    header: "Office",
    cell: ({ row }) => {
      const officeId = row.original.office?.id;
      const route = useRoute();
      return officeId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/offices/${officeId}`,
            },
           "View Office"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roleName = row.original.role?.name;
      const route = useRoute();
      return roleName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/staffRoles/${roleName}`,
            },
            row.getValue("role")?.name
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "supervisor",
    header: "Supervisor",
    cell: ({ row }) => {
      const supervisorId = row.original.supervisor?.id;
      const route = useRoute();
      return supervisorId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/staffs/${supervisorId}`,
            },
            "View Supervisor"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "startDate",
    header: "Assignment Date",
    cell: ({ row }) => {
      const startDate = row.getValue("startDate");
      return startDate
        ? h(
            "div",
            {
              class:
                "whitespace-nowrap truncate hover:w-full font-medium",
            },
            new Date(row.getValue("startDate")).toDateString()
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
        h(StaffAssignmentsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
