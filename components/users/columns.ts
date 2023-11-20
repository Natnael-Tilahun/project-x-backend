import type { ColumnDef } from "@tanstack/vue-table";
import DropdownAction from "@/components/DataTableDropDown.vue";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface User {
  id: string;
  phone: number;
  email: string;
  amount: number;
  accounts: number[];
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "Amount"),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "accounts",
    header: "Accounts",
    cell: ({ row }: any) => {
      return row
        .getValue("accounts")
        .map((accountItem: number, index: number) => [
          index > 0 && ",", // Add a comma before items after the first one
          " ", // Add a space between items
          h("span", { key: index }, accountItem),
        ]);
    },
  },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          payment,
        })
      );
    },
  },
];
