import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableRowActionsVue from "../DataTableRowActions.vue";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import TransactionLogOtherInfoDetailsVue from "../TransactionLogOtherInfoDetails.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface CustomerActivityLog {
  name: string;
  userName: string;
  userId: string;
  contactNumber: string;
  emailId: string;
  // module: string;
  // activityType: string;
  // customerId: string;
  // dataAndTime: string;
  // fromAccount: number;
  // toAccount: number;
  // amount: string;
  // currency: string;
  // mfaType: string;
  // mfaSecurityKey: string;
  // mfaState: string;
  // channel: string;
  // device: string;
  // os: string;
  // deviceId: string;
  // ipAddress: string;
  otherInfo: {};
}

// function viewCustomerDetail(id: string) {
//   alert(id);
//   navigateTo(`customerDetails/${id}`);
//   // navigator.clipboard.writeText(id);
// }

export const columns: ColumnDef<CustomerActivityLog>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "emailId",
    header: "Email ID",
  },
  {
    accessorKey: "otherInfo",
    header: "Other Info",
    cell: ({ row }) => {
      const additionalInfo = row.original.otherInfo;
      const showDetails = () => {
        return h(DropdownMenu, {}, [
          h(
            DropdownMenuTrigger,
            {
              class: "cursor-pointer underline",
            },
            "Views"
          ),
          h(
            DropdownMenuContent,
            {
              slot: "DropdownMenuContent",
            },
            [
              h(
                DropdownMenuItem,
                {},
                h(TransactionLogOtherInfoDetailsVue, {
                  class: "w-[900px]  right-0 ",
                  otherInfoData: additionalInfo,
                })
              ),
            ]
          ),
        ]);
      };
      return showDetails();
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
        h(DataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
