<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { computed } from "vue";
import { toast } from "../ui/toast";
const { deleteRoleById, getRoles, isLoading } = useRoles();
const loading = ref(isLoading.value);
const isError = ref(false);
const { setIsUpdated } = usePagesInfoStore();

const route = useRoute();
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  refetch: () => Promise<void>; // Accept refetch as a prop
}
const props = defineProps<DataTableRowActionsProps<any>>();

function viewRollDetails(name: string) {
  navigateTo(`/userRoles/roleDetails/${name}`);
  navigator.clipboard.writeText(name);
}

async function deleteRole(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteRoleById(id); // Call your API function to fetch roles
    console.log("Role deleted successfully");
    toast({
      title: "Role deleted successfully",
    });
    setIsUpdated({ isUpdated: true });
    // Reload the window after deleting the role
    window.location.reload();
  } catch (err) {
    console.error("Error deleting role:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
  }
}
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Icon name="majesticons:dots-horizontal" class="h-4 w-4"></Icon>
        <span class="sr-only">Open menu</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end" class="w-[160px]">
      <UiDropdownMenuItem @click="viewRollDetails(row.original.name)"
        >View</UiDropdownMenuItem
      >
      <UiDropdownMenuItem>Edit</UiDropdownMenuItem>
      <UiDropdownMenuItem>Deactivate</UiDropdownMenuItem>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuSeparator />
      <UiDropdownMenuItem
        @click="deleteRole(row.original.name)"
        class="text-red-500"
      >
        Delete
        <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
