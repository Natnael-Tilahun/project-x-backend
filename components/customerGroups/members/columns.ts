import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import GroupMembersDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { CustomerGroupMember } from "~/types";
import { h, inject } from "vue"; // Import inject


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<CustomerGroupMember>[] => [
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
  // {
  //   accessorKey: "group.groupName",
  //   header: "Group Name",
  //   cell: ({ row }) => {
  //     const groupId = row.original.group?.id
  //     return groupId
  //       ? h(
  //           NuxtLink,
  //           {
  //             class:
  //               "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
  //             to: `/customerGroups/${groupId}?activeTab=groupDetails`,
  //           },
  //           "View Group"
  //         )
  //       : h("p", "-");
  //   },
  // },
  {
    accessorKey: "customer.fullName",
    header: "Customer Fullname",
    cell: ({ row }) => {
      const customerId = row.original.customer?.id;
      const route = useRoute();
      return customerId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/customers/${customerId}`,
            },
           "View Customer"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      if (isActive) {
        return h(Badge, { class: " bg-green-600 " }, "Active");
      } else return h(Badge, { class: "bg-red-500 " }, "Inactive");
    },
  },
  {
    accessorKey: "assignedAt",
    header: "Assignment Date",
    cell: ({ row }) => {
      const assignedAt = row.getValue("assignedAt");
      return assignedAt
        ? h(
            "div",
            {
              class:
                "whitespace-nowrap truncate hover:w-full font-medium",
            },
            new Date(row.getValue("assignedAt")).toDateString()
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
        h(GroupMembersDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
