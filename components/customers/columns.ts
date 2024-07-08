import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import CustomerDataTableRowActionsVue from "./DataTableRowActions.vue";

export const columns: ColumnDef<Customer>[] = [
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
      const id = row.getValue("id");
      return id ? h(
        "div",
        { class: "w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
        row.getValue("id")
      ) : h("p", "-");
    },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const coreCustomerId = row.getValue("fullName");
      return coreCustomerId ? h("p", coreCustomerId) : h("p", "-");
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const coreCustomerId = row.getValue("email");
      return coreCustomerId ? h("p", coreCustomerId) : h("p", "-");
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const coreCustomerId = row.getValue("phone");
      return coreCustomerId ? h("p", coreCustomerId) : h("p", "-");
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const coreCustomerId = row.getValue("gender");
      return coreCustomerId ? h("p", coreCustomerId) : h("p", "-");
    },
  },
  {
    accessorKey: "coreCustomerId",
    header: "Core Customer Id",
    cell: ({ row }) => {
      const coreCustomerId = row.getValue("coreCustomerId");
      return coreCustomerId ? h("p", coreCustomerId) : h("p", "-");
    },
  },
  {
    accessorKey: "legacyCustomerId",
    header: "Legacy Customer Id",
    cell: ({ row }) => {
      const legacyCustomerId = row.getValue("legacyCustomerId");
      return legacyCustomerId ? h(
        "div",
        { class: "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium" },
        row.getValue("legacyCustomerId")
      ) : h("p", "-");
    },
  },
  {
    accessorKey: "branchId",
    header: "Branch Id",
    cell: ({ row }) => {
      const branchId = row.getValue("branchId");
      return branchId ? h("p", branchId) : h("p", "-");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return status ? h("p", status) : h("p", "-");
    },
  },
  {
    accessorKey: "coreLinked", header: "Core Linked",
    cell: ({ row }) => {
      const coreLinked = row.getValue("coreLinked");
      return coreLinked != null ? h("p", coreLinked) : h("p", "-");
    },
  },
  {
    accessorKey: "customerActivated", header: "Customer Activated",
    cell: ({ row }) => {
      const customerActivated = row.getValue("customerActivated");
      return customerActivated != null ? h("p", customerActivated) : h("p", "-");
    },
  },
  {
    accessorKey: "olbAllowed", header: "Olb Allowed",
    cell: ({ row }) => {
      const olbAllowed = row.getValue("olbAllowed");
      return olbAllowed != null ? h("p", olbAllowed) : h("p", "-");
    },
  },
  {
    accessorKey: "staffMember", header: "Staff Member",
    cell: ({ row }) => {
      const staffMember = row.getValue("staffMember");
      return staffMember != null ? h("p", staffMember) : h("p", "-");
    },
  },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.getValue("status");
  //     if (status == "Active") {
  //       return h(Badge, { class: "bg-green-600 " }, row.getValue("status"));
  //     } else if (status == "New") {
  //       return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
  //     } else if (status == "Locked") {
  //       return h(Badge, { class: "bg-red-500 " }, row.getValue("status"));
  //     } else if (status == "processing") {
  //       return h(Badge, { class: "bg-yellow-500 " }, row.getValue("status"));
  //     } else if (status == "UnEnrolled") {
  //       return h(Badge, { class: "bg-blue-500 " }, row.getValue("status"));
  //     } else if (status == "Suspended") {
  //       return h(Badge, { class: "bg-orange-700 " }, row.getValue("status"));
  //     } else {
  //       return h("div", { class: "" }, row.getValue("status"));
  //     }
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
        h(CustomerDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
