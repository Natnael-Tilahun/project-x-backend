import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../../ui/checkbox";
import ContractsUsersDataTableRowAction from "./DataTableRowActions.vue";
import { ContractsUsersAccounts, ContractsUsersDetails, NuxtLink } from "#components";
import type { ContractUser } from "~/types";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../../ui/alert-dialog";
import Sheet from "~/components/ui/sheet/Sheet.vue";
import SheetTrigger from "~/components/ui/sheet/SheetTrigger.vue";
import SheetContent from "~/components/ui/sheet/SheetContent.vue";

export const columns: ColumnDef<ContractUser>[] = [
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
                "View Details"
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
              to: `/users/${userId}`,
            },
            "View User"
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "serviceDefinitionRole",
    header: "Service Definition Role",
    cell: ({ row }) => {
      const serviceDefinitionRole = row.getValue("serviceDefinitionRole")?.id;
      return serviceDefinitionRole
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `/serviceDefinitionRoles/${serviceDefinitionRole}`,
            },
            "View Service Definition Role"
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
  {
    accessorKey: "accounts",
    header: "Accounts",
    cell: ({ row }) => {
      const userId = row.original.user?.id;
      const id = row.getValue("id");
      const contractUserId = row.original.id;
      return id
        ? h(
            Sheet,
            {
            },
            [
              h(
                SheetTrigger,
                {
                  class: "font-medium text-primary w-fit whitespace-nowrap",
                },
                "View Accounts"
              ),
              h(
                SheetContent,
                {
                  class: "md:w-2/3 md:max-w-none w-screen",    
                },
                [
                  h(ContractsUsersAccounts, { userId: userId || "", contractUserId: contractUserId || "" }), // Pass the `id` as a prop
                ]
              ),
            ]
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
        h(ContractsUsersDataTableRowAction, {
          row,
        })
      );
    },
  },
];
