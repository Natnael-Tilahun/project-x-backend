import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import CustomerGroupsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { CustomerGroup } from "~/types";
import { h } from "vue"; // Import inject


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<CustomerGroup>[] => [
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
    accessorKey: "groupName",
    header: "Group Name",
    cell: ({ row }) => {
      const groupId = row.original.id;
      const groupName = row.getValue("groupName");
      return groupName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/customerGroups/${groupId}`,
            },
            row.getValue("groupName")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "groupCode",
    header: "Group Code",
    cell: ({ row }) => {
      const groupCode = row.getValue("groupCode");
      return groupCode
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("groupCode")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("description")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "groupType",
    header: "Group Type",
    cell: ({ row }) => {
      const groupType = row.getValue("groupType");
      return groupType ? h("p", groupType) : h("p", "-");
    },
  },
  {
    accessorKey: "priorityLevel",
    header: "Priority Level",
    cell: ({ row }) => {
      const priorityLevel = row.getValue("priorityLevel");
      return priorityLevel ? h("p", priorityLevel) : h("p", "-");
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
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(CustomerGroupsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
