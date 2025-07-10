import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "../ui/badge";
import MerchantsOperatorsDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { MerchantOperators, StaffAssignment } from "~/types";
import { h, inject } from "vue"; // Import inject


// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<MerchantOperators>[] => [
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
    accessorKey: "merchantOperatorId	",
    header: "Operator Id",
    cell: ({ row }) => {
      const route = useRoute();
      const merchantOperatorId = row.original?.merchantOperatorId;
      return merchantOperatorId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}?activeTab=operatorDetails&operatorId=${merchantOperatorId}`,
            },
            merchantOperatorId ? merchantOperatorId : "View Details"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "fullName	",
    header: "FullName	",
    cell: ({ row }) => {
      const route = useRoute();
      const merchantOperatorId = row.original?.merchantOperatorId;
      const fullName	 = row.original.fullName
      return fullName	
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
                to: `${route.path}?activeTab=operatorDetails&operatorId=${merchantOperatorId}`,
              },
            fullName ? fullName : "View Operator"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "operatorCode",
    header: "operatorCode	",
    cell: ({ row }) => {
      const operatorCode = row.original.operatorCode;
      return operatorCode	
        ?  h(
          "div",
          {
            class:
              "whitespace-nowrap truncate hover:w-full font-medium",
          },
          row.getValue("operatorCode")
        )
        : h("p", "-");
    },
  },
  {
    accessorKey: "operatorRoleId",
    header: "Operator Role	",
    cell: ({ row }) => {
      const roleName = row.original?.operatorRoleId;
      return roleName
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/merchantRoles/${roleName}`,
            },
            row.getValue("operatorRoleId")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "merchantBranch",
    header: "Branch",
    cell: ({ row }) => {
      const merchantBranch = row.original?.merchantBranch;
      return merchantBranch
        ?  h(
          "div",
          {
            class:
              "whitespace-nowrap truncate hover:w-full font-medium",
          },
          row.getValue("merchantBranch")?.branchName
        )
        : h("p", "-");
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active");
      return active !== null
        ? h(
            "div",
            {
              class:
                "whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("active")
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
        h(MerchantsOperatorsDataTableRowActionsVue, {
          row,
          refetch
        })
      );
    },
  },
];
