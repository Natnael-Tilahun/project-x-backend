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
  //   accessorKey: "id",
  //   header: "Group Member",
  //   cell: ({ row }) => {
  //     const memberId = row.original?.id;
  //     const groupId = row.original?.group?.id
  //     const route = useRoute();
  //     return memberId
  //       ? h(
  //           NuxtLink,
  //           {
  //             class:
  //               "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
  //             to: `/customerGroups/${groupId}?activeTab=memberDetails&memberId=${memberId}`,
  //           },
  //           "View Details"
  //         )
  //       : h("p", "-");
  //   },
  // },
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => {
      const companyName	 = row.getValue("companyName");
      const integrationId	 = row.original.id;
      return companyName
          ? h(
                      NuxtLink,
                      {
                        class:
                          "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
                        to: `/paymentIntegrations/${integrationId}`,
                      },
                      row.getValue("companyName")
                    )
        : h("p", "-");
    },
  },
  {
    accessorKey: "integrationName",
    header: "Integration Name",
    cell: ({ row }) => {
      const integrationName	 = row.original.integrationName	;
      const route = useRoute();
      return integrationName
      ? h(
        "div",
        {
          class:
            "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
        },
        row.getValue("integrationName")
      )
        : h("p", "-");
    },
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => {
      const isActive = row.getValue("enabled");
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
