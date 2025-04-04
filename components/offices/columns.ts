import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import OfficesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";
import type { Office } from "~/types";
export const columns: ColumnDef<Office>[] = [
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
    header: "Office Name",
    cell: ({ row }) => {
      const officeId = row.original.id;
      const route = useRoute();
      const name = row.getValue("name");
      return name
        ? h(
            NuxtLink,
            {
              class:
                "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full",
              to: `${route.path}/${officeId}`,
            },
            row.getValue("name")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code");
      return code
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("code")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const state = row.getValue("state");
      return state
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("state")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "organizationRegion",
    header: "Organization Region",
    cell: ({ row }) => {
      const organizationRegion = row.getValue("organizationRegion");
      return organizationRegion ? h("p", organizationRegion) : h("p", "-");
    },
  },
  {
    accessorKey: "districtName",
    header: "District Name",
    cell: ({ row }) => {
      const districtName = row.getValue("districtName");
      return districtName ? h("p", districtName) : h("p", "-");
    },
  },
  {
    accessorKey: "description",
    header: "Description ",
    cell: ({ row }) => {
      const description = row.getValue("description");
      return description ? h("p", description) : h("p", "-");
    },
  },
  {
    accessorKey: "hierarchy",
    header: "Hierarchy",
    cell: ({ row }) => {
      const hierarchy = row.getValue("hierarchy");
      return hierarchy
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("hierarchy")
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "openingDate",
    header: "Opening Date",
    cell: ({ row }) => {
      const openingDate = row.getValue("openingDate");
      return openingDate
        ? h(
            "div",
            {
              class:
                "whitespace-nowrap truncate hover:w-full font-medium",
            },
            new Date(row.getValue("openingDate")).toDateString()
          )
        : h("p", "-");
    },
  },
  {
    accessorKey: "parent",
    header: "parent",
    cell: ({ row }) => {
      const parent = row.getValue("parent")
      return parent
        ? h(
            "div",
            {
              class:
                "max-w-[100px] whitespace-nowrap truncate hover:w-full font-medium",
            },
            row.getValue("parent")?.name
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
        h(OfficesDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
