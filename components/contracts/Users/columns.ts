import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../../ui/checkbox";
import ContractsUsersDataTableRowAction from "./DataTableRowActions.vue";
import {  ContractsUsersDetails, NuxtLink } from "#components";
import type { ContractUser } from "~/types";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";

import { h } from "vue"; // Import inject

// Type for the refetch function
type RefetchFunction = () => Promise<void>;

export const columns = (refetch: RefetchFunction): ColumnDef<ContractUser>[] => [
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
      const contractUserId = row.original.id;
      const id = row.getValue("id");
  
      return id
        ? h(
            AlertDialog,
            {},
            [
              h(
                AlertDialogTrigger,
                {
                  class: "font-medium text-primary w-fit whitespace-nowrap ",
                },
                "View User Details"
              ),
              h(
                AlertDialogContent,
                {},
                [
                  h(ContractsUsersDetails, { id: contractUserId || "" }), // Pass the `id` as a prop
                ]
              ),
            ]
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customerId = row.original?.customer?.id;
      const route = useRoute();
      return customerId
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/customers/${customerId}`,
            },
            row.getValue("customer")?.fullName
          )
        : h("p", "-");
    },
    filterFn: (row, id, value) => {
      const customer = row.getValue(id);
      return customer?.fullName?.toLowerCase().includes(value.toLowerCase());
    }
  },
  {
    accessorKey: "serviceDefinitionRole",
    header: "Service Definition Role",
    cell: ({ row }) => {
      const serviceDefinitionRole = row.getValue("serviceDefinitionRole");
      return serviceDefinitionRole
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/serviceDefinitions/${serviceDefinitionRole?.serviceDefinition?.id}?activeTab=serviceDefinitionRoleDetails&serviceDefinitionRoleId=${serviceDefinitionRole?.id}`,
            },
            serviceDefinitionRole?.roleName || "View Service Definition Role"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "enable",
    header: "Enable",
    cell: ({ row }) => {
      const enable = row.getValue("enable");
      return enable != null
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("enable")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "isPrimaryUser",
    header: "Primary User",
    cell: ({ row }) => {
      const isPrimaryUser = row.getValue("isPrimaryUser");
      return isPrimaryUser != null
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("isPrimaryUser")
          )
        : h("p", "-");
    },
  },
  // {
  //   accessorKey: "accounts",
  //   header: "Accounts",
  //   cell: ({ row }) => {
  //     const userId = row.original.user?.id;
  //     const id = row.getValue("id");
  //     const contractUserId = row.original.id;
  //     const contract = row.original.contract;
  //     return id
  //       ? h(
  //           Sheet,
  //           {
  //           },
  //           [
  //             h(
  //               SheetTrigger,
  //               {
  //                 class: "font-medium text-primary w-fit whitespace-nowrap",
  //               },
  //               "View Accounts"
  //             ),
  //             h(
  //               SheetContent,
  //               {
  //                 class: "md:w-3/4 md:max-w-none w-screen",    
  //               },
  //               [
  //                 h(ContractsUsersAccounts, { userId: userId || "", contractUserId: contractUserId || "", contract: contract || "" }), // Pass the `id` as a prop
  //               ]
  //             ),
  //           ]
  //         )
  //       : h("p", "-");
  //   },
  // },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        "div",
        { class: "relative" },
        h(ContractsUsersDataTableRowAction, {
          row,
          refetch
        })
      );
    },
  },
];
