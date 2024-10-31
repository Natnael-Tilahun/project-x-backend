import type { ColumnDef } from "@tanstack/vue-table";

import { Checkbox } from "../ui/checkbox";
import DataTableColumnHeaderVue from "../ui/dataTable/ColumnHeader.vue";
import { Badge } from "../ui/badge";
import UserRolesDataTableRowActionsVue from "./DataTableRowActions.vue";
import { NuxtLink } from "#components";

export const columns: ColumnDef<Role>[] = [
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
    header: "Role Name",
    cell: ({ row }) => {
      const route = useRoute();
      const roleName = row.getValue("name");
      return roleName ? h(NuxtLink, {  class: "font-medium text-primary w-fit whitespace-nowrap truncate hover:w-full", to: `${route.path}/roleDetails/${roleName}` }, roleName) : h("p", "-");
    },  },
  {
    accessorKey: "description",
    header: "Role Description",
  },
  {
    accessorKey: "enforce2fa",
    header: "Enforce 2fa",
    cell: ({ row }) => {
      const enforce = row.getValue("enforce2fa");
      if (enforce) {
        return h("p", "True");
      } else
        return h("p", "False");
    },
  },
  {
    accessorKey: "disabled",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("disabled");
      if (status) {
        return h(Badge, { class: "bg-red-500  " }, "Disabled");
      } else
        return h(Badge, { class: "bg-green-600 " }, "Enabled");

    },
  },
  {
    header: "Actions",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { getRoles, isLoading } = useRoles();
      const loading = ref(isLoading.value);
      const isError = ref(false);
      const data = ref<Role[]>([]);
      const refetch = async () => {
        alert("jkjk")
        try {
          isError.value = false; // Reset isError flag
          loading.value = true; // Show loading indicator
          data.value = await getRoles(); // Call your API function to refetch roles
        } catch (err) {
          console.error("Error refetching roles:", err);
          isError.value = true; // Set isError flag on error
        } finally {
          console.log("finally");
          loading.value = false; // Hide loading indicator
        }
      };
      return h(
        "div",
        { class: "relative" },
        h(UserRolesDataTableRowActionsVue, {
          row, refetch
        })
      );
    },
  },
];
