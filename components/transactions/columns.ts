import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../DataTableColumnHeader.vue";
import DataTableRowActionsVue from "../DataTableRowActions.vue";
import { Badge } from "../ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface TransactionLogs {
  module: string;
  activityType: string;
  customerId: string;
  userName: string;
  dataAndTime: string;
  fromAccount: number;
  toAccount: number;
  amount: string;
  currency: string;
  mfaType: string;
  mfaSecurityKey: string;
  mfaState: string;
  channel: string;
  device: string;
  os: string;
  deviceId: string;
  ipAddress: string;
  otherInfo: string;
}

export const columns: ColumnDef<TransactionLogs>[] = [
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
    accessorKey: "module",
    header: "Module",
  },
  {
    accessorKey: "activityType",
    header: "Activity Type",
  },
  {
    accessorKey: "customerId",
    header: "Customer Id",
  },
  { accessorKey: "userName", header: "UserName" },
  {
    accessorKey: "dataAndTime",
    header: ({ column }) =>
      h(DataTableColumnHeaderVue, { column, title: "dataAndTime" }),
  },
  { accessorKey: "fromAccount", header: "From Account" },
  { accessorKey: "toAccount", header: "To Account" },
  {
    accessorKey: "amount",
    header: "amount",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "mfaType",
    header: "MFA Type",
  },
  {
    accessorKey: "mfaSecurityKey",
    header: "MFA Security Key",
  },
  {
    accessorKey: "mfaState",
    header: "MFA State",
  },
  {
    accessorKey: "channel",
    header: "channel",
  },
  {
    accessorKey: "device",
    header: "Device",
  },
  {
    accessorKey: "os",
    header: "OS",
  },
  {
    accessorKey: "deviceId",
    header: "Device Id",
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "otherInfo",
    header: "Other Info",
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
