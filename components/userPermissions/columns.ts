import { Checkbox } from "../ui/checkbox";
import type { ColumnDef } from "@tanstack/vue-table";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UserPermissionsDataTableRowActionsVue from "./DataTableRowActions.vue";


export const columns: ColumnDef<Permission>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(
        Checkbox,

        {
          checked: table.getIsAllPageRowsSelected(),
          "onUpdate:checked": (value: boolean) =>
            table.toggleAllPageRowsSelected(!!value),
          ariaLabel: "Select all",
        }
      ),
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
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "entityName",
    header: "Name",
    cell: ({ row }) => {
      const entityName = row.getValue("entityName");
      if (entityName) {
        return h("p", entityName);
      } else
        return h("p", "None");

    },
  },
  {
    accessorKey: "description",
    header: "Permission Description",
  },
  {
    accessorKey: "grouping",
    header: "Grouping",
  },
  {
    accessorKey: "actionName",
    header: "Action Name",
    cell: ({ row }) => {
      const actionName = row.getValue("actionName");
      if (actionName) {
        return h("p", actionName);
      } else
        return h("p", "None");

    },
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    cell: ({ row }) => {
      const createdDate = new Date(row.getValue("createdDate"))
      const formattedCreatedDate = createdDate.toLocaleDateString();
      return h("p", formattedCreatedDate);
    },
  },
  {
    accessorKey: "lastModifiedBy",
    header: "Last modified by",
  },
  {
    accessorKey: "lastModifiedDate",
    header: "Last modified date",
    cell: ({ row }) => {
      const lastModifiedDate = new Date(row.getValue("lastModifiedDate"))
      const formattedLastModifiedDate = lastModifiedDate.toLocaleDateString();
      return h("p", formattedLastModifiedDate);
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
        h(UserPermissionsDataTableRowActionsVue, {
          row,
        })
      );
    },
  },
];
